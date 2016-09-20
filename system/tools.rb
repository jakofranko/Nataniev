#!/bin/env ruby
# encoding: utf-8

class String

  def like target

    if target.downcase == self.downcase then return true end

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

  def markup
    
    content = self

    if !content then return "" end
      
    search = content.scan(/(?:\{\{)([\w\W]*?)(?=\}\})/)
        search.each do |str,details|
            content = content.gsub("{{"+str+"}}",parser(str))
        end
        content = content.gsub("{_","<i>").gsub("_}","</i>")
        content = content.gsub("{*","<b>").gsub("*}","</b>")
        "#{content}"

  end

  def parser macro

    if macro.include?("|")
      if macro.split("|")[1].include?("http") then return "<a href='"+macro.split("|")[1]+"' class='external'>"+macro.split("|")[0]+"</a>"
      else return "<a href='"+macro.split("|")[1]+"'>"+macro.split("|")[0]+"</a>" end
    end
        return macro

  end

end

class Array

  def runes

    html = ""
    prev = ""
    self.each do |line|
      rune = line[0,1]
      text = line.sub(rune,"").strip
      html += prev == "-" && rune != "-" ? "<hr class='spacer'/>" : ""
      case rune
      when "&"
        html += "<p>#{text}</p>"
      when "="
        html += "<l class='head'>#{text}</l>"
      when "-"
        html += "<l>#{text}</l>"
      when "?"
        html += "<p class='note'>#{text}</p>"
      when "*"
        html += "<h2>#{text}</h2>"
      when "#"
        html += "<pre>#{text}</pre>"
      when "%" # TODO: Allow other formats, such as video and youtube links!
        html += "<img src='#{text}'/>"
      else
        html += "[??]#{text}[??]"
      end
      prev = rune
    end

    return html

  end

end