class Di

	def initialize query = nil

		@NAME = query.gsub(" ",".").downcase
		@TEXT = File.read("#{$nataniev_path}/library/dictionaries/#{@NAME}.di", :encoding => 'UTF-8').split("\n")

		content = []
		@TEXT.each do |line|
				if !@KEY && line.strip[0,1] == "@" then @KEY = parseKey(line) ; next end
				if !@KEY then next end
				content.push(parseLine(line))
		end
		if !@KEY then puts "Missing key" ; return nil end
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

		open("#{$nataniev_path}/library/dictionaries/#{@NAME}.di", 'a') do |f|
			f.puts line
		end

	end

	def save id, content

		save_lines([[id,content]])

	end

	def save_lines lines_array # [[id,content],[id,content]..]

		# Save
		headerLength = 5
		lines_array.each do |id,content|
			@TEXT[id+headerLength] = content.strip
		end
		
		# Create temp file
		out_file = File.new("#{$nataniev_path}/library/dictionaries/temp.#{@NAME}.di", "w")
		out_file.puts(@TEXT.join("\n"))
		out_file.close

		# Replace file
		File.rename("#{$nataniev_path}/library/dictionaries/temp.#{@NAME}.di", "#{$nataniev_path}/library/dictionaries/#{@NAME}.di")

	end

	# Accessors

	def to_a

		return @DICT

	end

	def line id

		return @DICT[id]

	end

	def length

		return @DICT.length

	end

end