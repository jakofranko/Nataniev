class En

  def initialize query = nil, path = $nataniev.path

    @NAME = query.gsub(" ",".").downcase
    @path = path
    @TEXT = File.read("#{path}/library/#{@NAME}.en", :encoding => 'UTF-8').split("\n")

    @NOTE = []
    @tree = {}
    @lines = []

    @GRID = loadGrid(@NAME)
    
  end

  attr_accessor :path

  def loadGrid file

    # Create @lines

    File.open("#{path}/library/#{file}.en","r:UTF-8") do |f|
      number = 0
      f.each_line do |line|
        depth = line[/\A */].size
        line = line.strip
        if line == "" then next end
        if line[0,1] == "~"
          @NOTE.push(line)
        else
          @lines.push([number,depth,line])
          number += 1
        end
      end
    end

    # Create @tree

    i = 0
    @tree[-1] = []
    while i < @lines.count
      l = @lines[i]
      if l[1] == 0 then @tree[-1].push(l[0]) end
      p = l[0]
      while p > -1
        pl = @lines[p]
        if pl[1] < l[1]
          if !@tree[pl[0]] then @tree[pl[0]] = [] end
          @tree[pl[0]].push(l[0])
          break
        end
        p -= 1
      end
      i += 1
    end

    # Parse

    content = {}
    @tree[-1].each do |id|
      if @tree[id] then content[@lines[id].last.strip] = makeBuild(id) end
    end

    return content

  end


  def makeBuild id

    if !@tree[id] then return end 
    parent = @lines[id].last.strip

    t = {}

    @tree[id].each do |id|
      child = @lines[id].last.strip
      value = makeBuild(id)
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

  def to_h

    return @GRID

  end

  def save

    # Add notes
    content = @NOTE.join("\n")+"\n\n"

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
    out_file = File.new("#{path}/library/#{@NAME}.txt", "w")
    out_file.puts(content)
    out_file.close

    # Replace file
    File.rename("#{path}/library/temp.#{@NAME}.txt", "#{path}/library/#{@NAME}.en")

  end

  # Filters

  def filter field, value, type

    return Object.const_get(type.capitalize).new(value.capitalize,@GRID[value.upcase])

  end

end
