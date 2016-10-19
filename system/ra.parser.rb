class Ra

  attr_accessor :name
  attr_accessor :path
  attr_accessor :payload

  def initialize query = nil, path = $nataniev.path

    @name = query.gsub(" ",".").downcase
    @path = File.exist?("#{path}/library/#{name}.ra") ? path : $nataniev.path
    @payload = get_payload
    
  end

  def to_a type = nil
    
    return @payload

  end

  def length

    return @payload.length

  end

  # Filters

  private

  def get_payload

    lines = []
    File.read("#{@path}/library/#{name}.ra", :encoding => 'UTF-8').split("\n").each do |line|
      if line[0,1] == "~" then next end
      if line.strip == "" then next end
      lines.push(line)
    end

    return lines

  end

end
