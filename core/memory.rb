#!/bin/env ruby
# encoding: utf-8

module Memory

  attr_accessor :name
  attr_accessor :path

  def initialize name = nil, dir

    @name    = name
    @path    = make_path(dir,ext)
    @render  = make_render(get_file)

  end

  def length

    return @render.length

  end

  def overwrite content
    
    # Create temp file
    out_file = File.new("#{$nataniev.path}/core/memory/#{@name}.tmp", "w")
    out_file.puts(content)
    out_file.close

    # Replace file
    File.rename("#{$nataniev.path}/core/memory/#{@name}.tmp", @path)

  end

  private

  def make_path dir,ext

    if File.exist?("#{dir}/memory/#{name}.#{ext}")
      return "#{dir}/memory/#{name}.#{ext}"
    elsif File.exist?("#{$nataniev.path}/core/memory/#{name}.#{ext}")
      return "#{$nataniev.path}/core/memory/#{name}.#{ext}"
    end
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

  # Filters

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

  # Editor

  def append line

    open(path, 'a') do |f|
      f.puts line
    end

  end

  private

  def make_render file

    key  = make_key(file)

    array = []
    file.each do |line|
      if line[0,1] == "~" then next end
      array.push(parse_line(key,line))
    end
    return array

  end

  def make_key file

    file.each do |line|
      if line.strip[0,1] != "@" then next end

      key_line = line.sub("@ ","").strip.sub(" ","   ")
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

  end

  def parse_line key,line

    value = {}
    key.each do |index,position|
      data = position.last < 0 ? line[position.first,line.length - position.first].to_s.strip : line[position.first,position.last].to_s.strip
      if data != "" then value[index] = data end
    end
    return value

  end

end

class En

  attr_accessor :name
  attr_accessor :path
  attr_accessor :note
  attr_accessor :lines

  def initialize query = nil, path = $nataniev.path

    @name = query.gsub(" ",".").downcase
    @path = path

    @lines = []
    @notes = []

    @tree = {}

    if File.exist?("#{path}/memory/#{name}.en")
      @file_path = "#{path}/memory/#{name}.en"
    else
      @file_path = "#{$nataniev.path}/core/memory/#{name}.en"
    end

    if File.exist?(@file_path)
      @GRID = render(name)  
    end

  end

  def to_h type = nil
    
    h = {}
    @GRID.each do |k,v|
      if type
        h[k] = Object.const_get(type.capitalize).new(k,v)
      else
        h[k] = v
      end
    end
    return h

  end

  def length

    return @GRID.length

  end

  def save

    # Add notes
    content = @note.join("\n")+"\n\n"

    # Create lines
    @GRID.sort.reverse.each do |key,values|
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

    # Create temp file
    out_file = File.new("#{path}/core/memory/#{name}.txt", "w")
    out_file.puts(content)
    out_file.close

    # Replace file
    File.rename("#{path}/core/memory/temp.#{name}.txt", "#{path}/core/memory/#{name}.en")

  end

  # Filters

  def filter field, value, type

    return Object.const_get(type.capitalize).new(value.capitalize,@GRID[value.upcase])

  end

  private

  def render file

    @lines, @notes = make_lines_notes(file)
    @tree = make_tree

    content = {}
    @tree[-1].each do |id|
      if @tree[id] then content[@lines[id].last.strip] = make_build(id) end
    end

    return content

  end

  def make_lines_notes file

    notes_a = []
    lines_a = []

    File.open(@file_path,"r:UTF-8") do |f|
      number = 0
      f.each_line do |line|
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
    end

    return lines_a, notes_a

  end

  def make_tree

    tree_h = {}

    i = 0
    tree_h[-1] = []
    while i < @lines.count
      l = @lines[i]
      if l[1] == 0 then tree_h[-1].push(l[0]) end
      p = l[0]
      while p > -1
        pl = @lines[p]
        if pl[1] < l[1]
          if !tree_h[pl[0]] then tree_h[pl[0]] = [] end
          tree_h[pl[0]].push(l[0])
          break
        end
        p -= 1
      end
      i += 1
    end

    return tree_h

  end

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
        if child.include?(" : ")
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
