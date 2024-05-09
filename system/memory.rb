#!/bin/env ruby
# encoding: utf-8

require "fileutils"

module Memory
  extend Gem::Deprecate

  attr_accessor :name
  attr_accessor :key
  attr_accessor :path
  attr_accessor :render
  attr_accessor :data_start

  @@note_char = "~"
  @@key_row_char = "@"

  def initialize name = nil, dir = "#{$nataniev.path}"

    @name    = "#{name}".downcase.gsub(" ",".")
    @path    = make_path(dir,ext)
    @key     = nil # Created as part of the render
    @data_start = nil # File line index where the front-matter ends and the real data begins
    @render  = make_render(get_file)

    # Used to handle simultaneous writes
    @is_updating = [] # Add line indexes when updating, then remove when done
    @is_appending = [] # Add lines to append here with format [memory_index, new_line] e.g., [[0, "new line 1"], [1, "new line 2"]]

  end

  def length

    return @render.length

  end

  def overwrite content

    # Create temp file
    dirs, file_name = File.split("#{$nataniev.path}/memory/#{@name}.tmp")

    if !File.exists? dirs then FileUtils.mkdir_p dirs end

    out_file = File.new("#{dirs}/#{file_name}", "w")
    out_file.puts(content)
    out_file.close

    # Replace file
    File.rename("#{$nataniev.path}/memory/#{@name}.tmp", @path)

    @render = make_render(get_file)

  end
  deprecate :overwrite, :replace_file, 2024, 12

  def overwrite_line id, line

    lines = File.readlines(@path)
    lines[id] = line << $/
    File.open(@path, 'w') { |f| f.write(lines.join) }
    @render = make_render(get_file)

  end
  deprecate :overwrite_line, :replace_line, 2024, 12

  private

  def make_path dir,ext

    if File.exist?("#{dir}/memory/#{name}.#{ext}")
      return "#{dir}/memory/#{name}.#{ext}"
    end
    puts "Cannot locate #{dir}/memory/#{name}.#{ext}"
    return nil

  end

  def get_file

    return File.read(@path, :encoding => 'UTF-8').split("\n")

  end

  def replace_line memory_index, new_line

    if @data_start.nil? then
      raise "#{@name} Memory: Data has not been rendered yet, and cannont replace line with #{new_line}"
    end

    # Get the actual index by adding the memory index to the start of data index
    file_index = @data_start + memory_index

    lines = File.readlines(@path)
    lines[file_index] = new_line << $/
    File.open(@path, 'w') { |f| f.write(lines.join) }

  end

  def replace_file content

    # Perform an atomic update by first creating a temp file
    dirs, file_name = File.split("#{$nataniev.path}/memory/#{@name}.tmp")

    if !File.exists? dirs then FileUtils.mkdir_p dirs end

    out_file = File.new("#{dirs}/#{file_name}", "w")
    out_file.puts(content)
    out_file.close

    # Replace file to complete atomic update
    File.rename("#{$nataniev.path}/memory/#{@name}.tmp", @path)

  end

  def append_line line

    File.open(@path, 'a') do |f|
      f.puts line
    end

  end

end

#

class Memory_Array

  include Memory

  def initialize name = nil, dir = nil
    super

    @a = []
    @last_field = nil
    @last_value = nil
    @last_a_type = nil
    @last_filter_type = nil
    @last_filtered_a = nil

  end

  def ext ; return "ma" end

  # Methods

  def filter field, value, type

    if field == @last_field && last_value == @last_value && type == @last_filter_type then
      return @last_filtered_a
    end

    new_filtered_a = []

    if @a.length && type == @last_type then
      @a.each do |obj|
        if value != "*" && (!obj.has(field) || !obj[field].to_s.like(value)) then next end
        new_filtered_a.push(obj)
      end
    else
      @render.each do |line|
        # TODO: I don't think this works, but it was here...might need to fix
        if value != "*" && !line[field].to_s.like(value) then next end
        new_filtered_a.push(type ? Object.const_get(type.capitalize).new(line) : line)
      end
    end


    @last_field = field
    @last_value = value
    @last_filter_type = type
    @last_filtered_a = new_filtered_a
    return new_filtered_a

  end

  def to_a type = nil

    # Return cached array to avoid regenerating
    if @a.length && type == @last_a_type then return @a end

    @a = []
    i = 0
    @render.each do |line|
      @a.push(type ? Object.const_get(type.capitalize).new(line, i) : line)
      i += 1
    end

    @last_a_type = type
    return @a

  end

  def append line
    
    append_line line

    parsed_line = parse_line(@key, line)
    @render.append(parsed_line)
    append_a parsed_line

  end

  def update memory_index, new_line

    already_updating_line = @is_updating.include? memory_index

    if already_updating_line then
      return false
    end

    @is_updating.append(memory_index)

    # TODO: Do this in a new thread
    self.replace_line(memory_index, new_line)

    parsed_line = parse_line(@key, new_line)
    @render[memory_index] = parsed_line
    update_a(memory_index, parsed_line)

    @is_updating.delete(memory_index)

  end

  ##
  # Takes a hash that has the same form as a
  # rendered row (a single item from @render),
  # and converts it to a string that can be used to update
  # the memory file associated with this memory.
  def hash_to_line row

      puts "HASH ROW"
      puts row.inspect
      puts @key

    line = ''
    @key.each do |key, positions|
        open = positions[0]
        length = positions[1]
        val = row[key.to_sym]

        if val then
            puts "appending"
            line << val.append(" ", length)
        end

        puts 'LINE'
        puts line.inspect
    end

    return line

  end

  private

  def make_render file

    array = []

    i = 0
    file.each do |line|
        if line == "" || line[0,1] == @@note_char then
          i += 1
          next
        end
        if line[0,1] == @@key_row_char
            @key = make_key(line)
            i += 1
        elsif @key
            if @data_start.nil? then @data_start = i end # set where data begins
            array.push(parse_line(@key,line))
        end
    end

    return array

  end

  def make_key key_line

    key_line = key_line.sub("#{@@key_row_char} ","").strip.sub(" ","   ")
    key = {}
    parts = key_line.split(" ")

    parts.each_index do |i|
      part = parts[i]
      next_part = parts[i + 1]
      open  = key_line.index(part)
      close = next_part ? key_line.index(next_part) : 0
      key[part] = [open, close - open - 1]
    end

    return key

  end

  def parse_line key, line

    if key.length == 1 then return line end

    value = {}
    key.each do |index, position|
      open = position[0]
      length = position[1]

      data = length < 0 ? line[open, line.length - open].to_s.strip : line[open, length].to_s.strip
      if data != "" then value[index] = data end
    end

    return value

  end

  def append_a new_line

    unless @a.length == 0 then
      @a.push(@last_a_type ? Object.const_get(@last_a_type.capitalize).new(new_line, @a.length) : new_line)
    end

  end

  def update_a memory_index, line

    unless @a.length == 0 then
      @a[memory_index] = @last_a_type ? Object.const_get(@last_a_type.capitalize).new(line, memory_index) : line
    end

  end

end

#

class Memory_Hash

  include Memory

  @@indent_amount = 4

  attr_accessor :render

  def ext ; return "mh" end

  def filter field = "", value = "", type = ""

    return Object.const_get(type.to_s.capitalize).new(value.to_s.capitalize,@render[value.to_s.upcase])

  end

  def to_h type = nil

    h = {}
    @render.each do |k,v|
      h[k] = type ? Object.const_get(type.capitalize).new(k,v) : v
    end
    return h

  end

  def save

    # Add notes
    content = @notes.join("\n")+"\n\n"

    def make_key_val k, v, depth = 0
        content = ""
        if v.kind_of?(Array)
            content += "#{' ' * depth}#{k}\n"
            v.each do |val|
                content += "#{' ' * depth + @@indent_amount}#{val}\n"
            end
        elsif v.kind_of?(Hash)
            content += "#{' ' * depth}#{k}\n"
            v.each do |key, value|
                content += make_key_val(key, value, depth + @@indent_amount)
            end
        elsif k
            content += "#{' ' * depth}#{k} : #{v}\n"
        end

        return content
    end

    # Create lines
    @render.sort.reverse.each do |key, values|
      content += make_key_val(key, values)
    end

    overwrite(content)

  end

  private

    def make_render file

        @lines, @notes = make_lines_notes(file)
        @tree = make_tree

        content = {}
        @tree[-1].each do |id|
            line = @lines[id].last.strip
            if @tree[id] then
                content[line] = make_build(id)
            elsif line.include? " : "
                key, val = line.split(" : ")
                content[key] = val
            end
        end

        return content

    end

  def make_lines_notes file

    notes_a = []
    lines_a = []

    number = 0
    get_file.each do |line|
      depth = line[/\A */].size
      line = line.strip
      if line == "" then next end
      if line[0,1] == "~"
        notes_a.push(line)
      else
        lines_a.push([number,depth,line])
        number += 1
      end
    end

    return lines_a, notes_a

  end

  def make_tree

    tree_h = {}

    i = 0
    tree_h[-1] = []
    while i < @lines.count
      l = @lines[i]
      line_number = l[0]
      depth = l[1]
      if depth == 0 then tree_h[-1].push(line_number) end
      p = line_number
      while p > -1
        pl = @lines[p]
        if pl[1] < depth
          if !tree_h[pl[0]] then tree_h[pl[0]] = [] end
          tree_h[pl[0]].push(line_number)
          break
        end
        p -= 1
      end
      i += 1
    end

    return tree_h

  end

  # TODO: Cleanup
  def make_build id

    if !@tree[id] then return end
    parent = @lines[id].last.strip

    t = {}

    @tree[id].each do |id|
      child = @lines[id].last.strip
      value = make_build(id)
      if value != nil
        if !t.kind_of?(Hash) then t = {} end
        t[child] = value
      else
        if child.include?(" : ") && t.kind_of?(Hash)
          if !t.kind_of?(Hash) then t = {} end
          t[child.split(" : ").first.strip] = child.split(" : ").last.strip
        else
          if t.kind_of?(Hash) then t = [] end
          t.push(child)
        end
      end
    end

    return t

  end

end
