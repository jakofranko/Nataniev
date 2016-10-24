#!/bin/env ruby
# encoding: utf-8

class Memory

  def initialize name = nil

  end

end

class Di

  attr_accessor :path
  attr_accessor :name

  def initialize query = nil, path = $nataniev.path

    @name = query.gsub(" ",".").downcase
    @path = path

    if File.exist?("#{path}/memory/#{name}.di")
      @file_path = "#{path}/memory/#{name}.di"
    else
      @file_path = "#{$nataniev.path}/core/memory/#{name}.di"
    end

    @TEXT = File.read(@file_path, :encoding => 'UTF-8').split("\n")

    content = []
    @TEXT.each do |line|
        if line.strip[0,1] == "@" then @KEY = parseKey(line) ; next end
        if !@KEY then next end
        content.push(parseLine(line))
    end

    @DICT = content

  end

  def parseKey keyString

    keyString = keyString.sub("@ ","").strip.sub(" ","   ")
    key = {}
    parts = keyString.split(" ")
    i = 0
    parts.each do |part|
      open  = keyString.index(part)
      close = parts[i+1] ? keyString.index(parts[i+1]) : 0
      key[part] = [open,close-open-1]
      i += 1
    end
    return key

  end

  def parseLine line

    value = {}
    @KEY.each do |index,position|
      data = position.last < 0 ? line[position.first,line.length - position.first].to_s.strip : line[position.first,position.last].to_s.strip
      if data != "" then value[index] = data end
    end
    return value

  end

  # Edits

  def add line

    open("#{path}/core/memory/#{@NAME}.di", 'a') do |f|
      f.puts line
    end

  end

  def save_line id, content

    save_lines([[id,content]])

  end

  def save_lines lines_array # [[id,content],[id,content]..]

    # Save
    headerLength = 5
    lines_array.each do |id,content|
      @TEXT[id+headerLength] = content.strip
    end
    
    # Create temp file
    out_file = File.new("#{path}/core/memory/temp.#{@NAME}.di", "w")
    out_file.puts(@TEXT.join("\n"))
    out_file.close

    # Replace file
    File.rename("#{path}/core/memory/temp.#{@NAME}.di", "#{$nataniev.path}/core/memory/#{@NAME}.di")

  end

  # Accessors

  def to_a type = nil

    a = []
    @DICT.each do |line|
      if type then a.push(Object.const_get(type.capitalize).new(line))
      else a.push(line) end
    end
    return a

  end

  def line id

    return @DICT[id]

  end

  def length

    return @DICT.length

  end

  # Filters

  def filter field, value, type

    a = []
    @DICT.each do |line|
      if !line[field.upcase].to_s.like(value) && value != "*" then next end
      a.push(Object.const_get(type.capitalize).new(line))
    end
    return a

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

class Ra

  attr_accessor :name
  attr_accessor :path
  attr_accessor :payload

  def initialize query = nil, path = $nataniev.path

    @name = query.gsub(" ",".").downcase
    @path = File.exist?("#{path}/core/memory/#{name}.ra") ? path : $nataniev.path
    @payload = get_payload
    
  end

  def to_a type = nil
    
    return @payload

  end

  def to_s

    return @payload.join("\n")

  end

  def length

    return @payload.length

  end

  def replace text

    # Create temp file
    out_file = File.new("#{path}/core/memory/temp.#{@name}.ra", "w")
    out_file.puts(text)
    out_file.close

    # Replace file
    File.rename("#{path}/core/memory/temp.#{@name}.ra", "#{@path}/core/memory/#{@name}.ra")

  end

  # Filters

  private

  def get_payload

    lines = []
    File.read("#{@path}/core/memory/#{name}.ra", :encoding => 'UTF-8').split("\n").each do |line|
      if line[0,1] == "~" then next end
      if line.strip == "" then next end
      lines.push(line)
    end

    return lines

  end

end
