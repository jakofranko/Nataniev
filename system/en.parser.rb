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

    if !File.exist?("#{path}/library/#{name}.en") then @path = $nataniev.path end

    @GRID = render(name)
    
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
    out_file = File.new("#{path}/library/#{name}.txt", "w")
    out_file.puts(content)
    out_file.close

    # Replace file
    File.rename("#{path}/library/temp.#{name}.txt", "#{path}/library/#{name}.en")

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

    File.open("#{path}/library/#{file}.en","r:UTF-8") do |f|
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
