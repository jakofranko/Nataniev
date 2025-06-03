#!/bin/env ruby
require 'fileutils'
require 'thread'

# This module is for managing the Nataniev data format: memories
#
# I've altered this class in a couple of key ways from the original
# implementation to improve performance and avoid race conditions where
# multiple users might try to update the same memory at the same time.
#
# 1. The deprecated `overwrite` methods would write to the memory file
# and then regenerate the "render". Even for memories of a modest size,
# this operation could take multiple seconds every time. I created new methods
# that only handle the file writing, and additional methods that would simply
# update the render in place, rather than regenerating.This made a huge boost
# to performace.
# 2. These updates not use the Memory's instance mutex to synchronize updates
# to the render and file writes.
# 3. TODO: Implement a `Queue` for file writes, which is a thread-safe way of
# handling sequential operations. The queue would take arrays as items with the
# structure [memory_index, new_line, operation] where `operation` could be
# "update" or "append". When the memory is initialized, I start a long-running
# thread to loop over this queue to perform the operations as they get added to
# the queue.
# This would happen in the `Memory` parent class's `initialize` function.
# The implementations of this class, `Memory_Array` and `Memory_Hash`, can then
# push updates or appends into the queue in their own threads as well as update
# their respective renders in separate threads. The Ruby `Mutex` structure is
# used on the renders to make sure that race-conditions do not occur on the renders,
# while the Queue ensures that race-conditions do not occur on the file-writes.
# Putting all these operations within their own threads should also keep memory
# changes performant without locking the main thread.
module Memory

  extend Gem::Deprecate

  attr_accessor :name, :key, :path, :render, :data_start

  NOTE_CHAR = '~'.freeze
  KEY_ROW_CHAR = '@'.freeze

  def initialize(name = nil, dir = $nataniev.path.to_s)

    # Used to handle simultaneous writes
    @make_render_mutex = Mutex.new
    @append_mutex = Mutex.new
    @filter_mutex = Mutex.new
    @update_mutex = Mutex.new

    # Basic Memory attributes
    @name    = name.to_s.downcase.gsub(' ', '.')
    @path    = make_path(dir, ext)
    @key     = nil # Created as part of the render
    @data_start = nil # File line index where the front-matter ends and the real data begins
    @render = make_render(get_file)

  end

  def length

    @render.length

  end

  # Deprecated because it does the file write as well as re-generates
  # the render. The replace_file function only handles the file write
  # and other methods are used to handle changing the render without
  # regenerating it fully.
  def overwrite(content)

    # Create temp file
    dirs, file_name = File.split("#{$nataniev.path}/memory/#{@name}.tmp")

    FileUtils.mkdir_p dirs unless File.exist? dirs

    out_file = File.new("#{dirs}/#{file_name}", 'w')
    out_file.puts(content)
    out_file.close

    # Replace file
    File.rename("#{$nataniev.path}/memory/#{@name}.tmp", @path)

    @render = make_render(get_file)

  end
  deprecate :overwrite, :replace_file, 2024, 12

  # Deprecated because it does the file write as well as re-generates
  # the render. The replace_line function only handles the file write
  # and other methods are used to handle changing the render without
  # regenerating it fully.
  def overwrite_line(id, line)

    lines = File.readlines(@path)
    lines[id] = line << $/
    File.open(@path, 'w') { |f| f.write(lines.join) }
    @render = make_render(get_file)

  end
  deprecate :overwrite_line, :replace_line, 2024, 12

  private

  def make_path(dir, ext)

    return "#{dir}/memory/#{name}.#{ext}" if File.exist?("#{dir}/memory/#{name}.#{ext}")

    puts "Cannot locate #{dir}/memory/#{name}.#{ext}"
    nil

  end

  def get_file

    File.read(@path, encoding: 'UTF-8').split("\n")

  end

  def replace_line(memory_index, new_line)

    if @data_start.nil?
      raise "#{@name} Memory: Data has not been rendered yet, and cannont replace line with #{new_line}"
    end

    # Get the actual index by adding the memory index to the start of data index
    file_index = @data_start + memory_index

    lines = File.readlines(@path)
    lines[file_index] = new_line << $/
    File.open(@path, 'w') { |f| f.write(lines.join) }

  end

  def replace_file(content)

    # Perform an atomic update by first creating a temp file
    dirs, file_name = File.split("#{$nataniev.path}/memory/#{@name}.tmp")

    FileUtils.mkdir_p dirs unless File.exist? dirs

    out_file = File.new("#{dirs}/#{file_name}", 'w')
    out_file.puts(content)
    out_file.close

    # Replace file to complete atomic update
    File.rename("#{$nataniev.path}/memory/#{@name}.tmp", @path)

  end

  def append_line(line)

    File.open(@path, 'a') do |f|

      f.puts line

    end

  end

end

# The Memory_Array is a table-like data structure
class Memory_Array

  include Memory

  def initialize(name = nil, dir = nil)
    super

    @a = []
    @last_field = nil
    @last_value = nil
    @last_a_type = nil
    @last_filter_type = nil
    @last_filtered_a = nil

    # Method mutexes for thread-safety
    @to_a_mutex = Mutex.new
    @append_a_mutex = Mutex.new
    @update_a_mutex = Mutex.new

  end

  def ext
    'ma'
  end

  # Methods

  def filter(field, value, type)

    return @last_filtered_a if field == @last_field && value == @last_value && type == @last_filter_type

    @filter_mutex.synchronize do

      new_filtered_a = []

      if !@a.empty? && type == @last_type
        @a.each do |obj|

          next if value != '*' && (!obj.has(field) || !obj[field].to_s.like(value))

          new_filtered_a.push(obj)

        end
      else
        @render.each do |line|

          # TODO: I don't think this works, but it was here...might need to fix
          next if value != '*' && !line[field].to_s.like(value)

          new_filtered_a.push(type ? Object.const_get(type.capitalize).new(line) : line)

        end
      end

      @last_field = field
      @last_value = value
      @last_filter_type = type
      @last_filtered_a = new_filtered_a
      new_filtered_a

    end

  end

  def to_a(type = nil)

    # Return cached array to avoid regenerating
    return @a if @a.length && !type.nil? && type == @last_a_type

    @to_a_mutex.synchronize do

      @a = []
      i = 0
      @render.each do |line|

        @a.push(type ? Object.const_get(type.capitalize).new(line, i) : line)
        i += 1

      end

      @last_a_type = type
      @a

    end

  end

  def append(line)

    @append_mutex.synchronize do

      append_line line

      parsed_line = parse_line(@key, line)
      @render.append(parsed_line)
      append_a parsed_line

    end

  end

  def update(memory_index, new_line)

    @update_mutex.synchronize do

      # TODO: Do this in a new thread
      replace_line(memory_index, new_line)

      parsed_line = parse_line(@key, new_line)
      @render[memory_index] = parsed_line
      update_a(memory_index, parsed_line)

    end

  end

  ##
  # WIP: Takes a hash that has the same form as a
  # rendered row (a single item from @render),
  # and converts it to a string that can be used to update
  # the memory file associated with this memory.
  def hash_to_line(row)

    puts 'HASH ROW'
    puts row.inspect
    puts @key

    line = ''
    @key.each do |key, positions|

      length = positions[1]
      val = row[key.to_sym]

      if val
        puts 'appending'
        line << val.append(' ', length)
      end

      puts 'LINE'
      puts line.inspect

    end

    line

  end

  private

  def make_render(file)

    array = []
    key = nil
    data_start = nil

    i = 0
    file.each do |line|

      if line == '' || line[0, 1] == NOTE_CHAR
        i += 1
        next
      end

      next if key && line[0, 1] == KEY_ROW_CHAR

      if key.nil? && line[0, 1] == KEY_ROW_CHAR
        key = make_key(line)
        i += 1
        next
      end

      if key
        if data_start.nil? then data_start = i end # set where data begins
        array.push(parse_line(key, line))
      end

    end

    @make_render_mutex.synchronize do

      @key = key
      @data_start = data_start

    end

    array

  end

  def make_key(key_line)

    key_line = key_line.sub("#{KEY_ROW_CHAR} ", '').strip.sub(' ', '   ')
    key = {}
    parts = key_line.split(' ')

    parts.each_index do |i|

      part = parts[i]
      next_part = parts[i + 1]
      open  = key_line.index(part)
      close = next_part ? key_line.index(next_part) : 0
      key[part] = [open, close - open - 1]

    end

    key

  end

  def parse_line(key, line)

    return line if key.length == 1

    value = {}
    key.each do |index, position|

      open = position[0]
      length = position[1]

      data = length.negative? ? line[open, line.length - open].to_s.strip : line[open, length].to_s.strip
      value[index] = data if data != ''

    end

    value

  end

  def append_a(new_line)

    @append_a_mutex.synchronize do

      @a.push(@last_a_type ? Object.const_get(@last_a_type.capitalize).new(new_line, @a.length) : new_line)

    end

  end

  def update_a(memory_index, line)

    return if @a.empty?

    @update_a_mutex.synchronize do

      @a[memory_index] = @last_a_type ? Object.const_get(@last_a_type.capitalize).new(line, memory_index) : line

    end

  end

end

# Memory_Hash is a Nataniev data structure similar to YAML
# TODO: make thread-safe
# TODO: refactor deprecated methods
class Memory_Hash

  include Memory

  INDENT_AMOUNT = 4

  attr_accessor :render

  def ext
    'mh'
  end

  def filter(_, value = '', type = '')

    Object.const_get(type.to_s.capitalize).new(value.to_s.capitalize, @render[value.to_s.upcase])

  end

  def to_h(type = nil)

    h = {}
    @render.each do |k, v|

      h[k] = type ? Object.const_get(type.capitalize).new(k, v) : v

    end
    h

  end

  def save

    # Add notes
    content = "#{@notes.join("\n")}\n\n"

    make_key_val = lambda { |k, v, depth = 0|

      content = ''
      if v.is_a?(Array)
        content += "#{' ' * depth}#{k}\n"
        v.each do |val|

          content += "#{' ' * depth + INDENT_AMOUNT}#{val}\n"

        end
      elsif v.is_a?(Hash)
        content += "#{' ' * depth}#{k}\n"
        v.each do |key, value|

          content += make_key_val.call(key, value, depth + INDENT_AMOUNT)

        end
      elsif k
        content += "#{' ' * depth}#{k} : #{v}\n"
      end

      content

    }

    # Create lines
    @render.sort.reverse.each do |key, values|

      content += make_key_val.call(key, values)

    end

    overwrite(content)

  end

  private

  def make_render(file)

    @lines, @notes = make_lines_notes(file)
    @tree = make_tree

    content = {}
    @tree[-1].each do |id|

      line = @lines[id].last.strip
      if @tree[id]
        content[line] = make_build(id)
      elsif line.include? ' : '
        key, val = line.split(' : ')
        content[key] = val
      end

    end

    content

  end

  def make_lines_notes(file)

    notes_a = []
    lines_a = []

    number = 0
    file.each do |line|

      depth = line[/\A */].size
      line = line.strip
      next if line == ''

      if line[0, 1] == '~'
        notes_a.push(line)
      else
        lines_a.push([number, depth, line])
        number += 1
      end

    end

    [lines_a, notes_a]

  end

  def make_tree

    tree_h = {}

    i = 0
    tree_h[-1] = []
    while i < @lines.count
      l = @lines[i]
      line_number = l[0]
      depth = l[1]
      tree_h[-1].push(line_number) if depth.zero?
      p = line_number
      while p > -1
        pl = @lines[p]
        if pl[1] < depth
          tree_h[pl[0]] = [] unless tree_h[pl[0]]
          tree_h[pl[0]].push(line_number)
          break
        end
        p -= 1
      end
      i += 1
    end

    tree_h

  end

  # TODO: Cleanup
  def make_build(id)

    return unless @tree[id]

    t = {}

    @tree[id].each do |t_id|

      child = @lines[t_id].last.strip
      value = make_build(t_id)
      if !value.nil?
        t = {} unless t.is_a?(Hash)
        t[child] = value
      elsif child.include?(' : ') && t.is_a?(Hash)
        t = {} unless t.is_a?(Hash)
        t[child.split(' : ').first.strip] = child.split(' : ').last.strip
      else
        t = [] if t.is_a?(Hash)
        t.push(child)
      end

    end

    t

  end

end
