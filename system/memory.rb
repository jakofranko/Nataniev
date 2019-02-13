#!/bin/env ruby
# encoding: utf-8

module Memory

  attr_accessor :name
  attr_accessor :path
  attr_accessor :render

  def initialize name = nil, dir = "#{$nataniev.path}"

    @name    = "#{name}".downcase.gsub(" ",".")
    @path    = make_path(dir,ext)
    @render  = make_render(get_file)

  end

  def length

    return @render.length

  end

  def overwrite content

    # Create temp file
    out_file = File.new("#{$nataniev.path}/memory/#{@name}.tmp", "w")
    out_file.puts(content)
    out_file.close

    # Replace file
    File.rename("#{$nataniev.path}/memory/#{@name}.tmp", @path)

  end

  def overwrite_line id, line

    lines = File.readlines(@path)
    lines[id] = line << $/
    File.open(@path, 'w') { |f| f.write(lines.join) }

  end

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

end

#

class Memory_Array

  include Memory

  def ext ; return "ma" end

  # Methods

  def filter field, value, type

    a = []
    @render.each do |line|
      if !line[field.upcase].to_s.like(value) && value != "*" then next end
      a.push(type ? Object.const_get(type.capitalize).new(line) : line)
    end
    return a

  end

  def to_a type = nil

    a = []
    @render.each do |line|
      a.push(type ? Object.const_get(type.capitalize).new(line) : line)
    end
    return a

  end

  def append line

    open(path, 'a') do |f|
      f.puts line
    end

  end

  private

  def make_render file

    array = []
    key = nil

    file.each do |line|
      if line[0,1] == "~" then next end
      if line[0,1] == "@"
        key = make_key(line)
      elsif key
        array.push(parse_line(key,line))
      end
    end
    return array

  end

  def make_key key_line

    key_line = key_line.sub("@ ","").strip.sub(" ","   ")
    key = {}
    parts = key_line.split(" ")
    i = 0
    parts.each do |part|
      open  = key_line.index(part)
      close = parts[i+1] ? key_line.index(parts[i+1]) : 0
      key[part] = [open,close-open-1]
      i += 1
    end
    return key

  end

  def parse_line key,line

    if key.length == 1 then return line end

    value = {}
    key.each do |index,position|
      data = position.last < 0 ? line[position.first,line.length - position.first].to_s.strip : line[position.first,position.last].to_s.strip
      if data != "" then value[index] = data end
    end
    return value

  end

end

#

class Memory_Hash

  include Memory

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
    content = @note.join("\n")+"\n\n"

    # Create lines
    @render.sort.reverse.each do |key,values|
      content += "#{key}\n"
      values.each do |k,v|
        if v.kind_of?(Array)
          content += "  #{k}\n"
          v.each do |val,test|
            content += "    #{val}\n"
          end
        elsif k
          content += "  #{k} : #{v}\n"
        end
      end
      content += "\n"
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
