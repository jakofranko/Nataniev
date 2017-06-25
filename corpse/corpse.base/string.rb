class String

  def like target

    if target.to_s.downcase.gsub(/[^a-z0-9\s]/i, '') == self.to_s.downcase.gsub(/[^a-z0-9\s]/i, '') then return true end

  end

  def similar target

    s1 = self.chars.sort.join
    target = target.chars.sort.join
    score = 0
    
    c = 0
    while c < s1.length
      if target.include?(s1[c,s1.length - c]) then score += 1 end
      if target.include?(s1[0,s1.length - c]) then score += 1 end
      c += 1
    end

    return score/(target.length * 2).to_f

  end

  def append filler = " ",length

    filled = self
    while filled.length < length
      filled += filler
    end
    return "#{filled}"
    
  end

  def prepend filler = " ",length

    filled = self
    while filled.length < length
      filled = filler+filled
    end
    return "#{filled}"
    
  end
  
  def colorize(color_code)
    "\e[#{color_code}m#{self}\e[0m"
  end

  def rainbow
    i = 0
    while i < 50
      puts "#{i}".colorize(i)
      i += 1
    end
  end

end