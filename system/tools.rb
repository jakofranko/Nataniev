#!/bin/env ruby
# encoding: utf-8

def load_folder path

  Dir[path].each do |file_name|
    load file_name
  end

end

def require_folder path

  Dir[path].each do |file_name|
    require file_name
  end

end

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
    return "#{content}"

  end

  def parser macro

    if macro == "!clock" then return "<a href='/Clock'>#{Clock.new().default}</a>" end
    if macro == "!desamber" then return "<a href='/Desamber'>#{Desamber.new().default}</a>" end

    if macro.include?("|")
      if macro.split("|")[1].include?("http") then return "<a href='"+macro.split("|")[1]+"' class='external'>"+macro.split("|")[0]+"</a>"
      else return "<a href='"+macro.split("|")[1]+"'>"+macro.split("|")[0]+"</a>" end
    end
    return macro

  end

end

class Array

  def runes_collection

    return {
      "&" => {"tag" => "p"},
      "-" => {"tag" => "list", "stash" => "true"},
      "#" => {"tag" => "code", "stash" => "true"},
      "?" => {"tag" => "nt"},
      "*" => {"tag" => "h2"},
      "+" => {"tag" => "hs"}
    }
    
  end

  def runes

    html = ""
    prev = ""
    collection = runes_collection
    stash = ""
    tag = ""

    self.each do |line|
      rune = line[0,1]
      text = line.sub(rune,"").strip
      tag  = collection[rune] ? collection[rune]['tag'] : "unknown"

      if rune == "%" then html += Media.new("generic",text).to_html ; next end

      if stash != "" && rune != prev
        html += "<#{tag}>#{stash}</#{tag}>"
        stash = ""
      end

      if collection[rune]["stash"]
        stash += "#{text}<br />"
      else
        html += "<#{tag}>#{text}</#{tag}>"
      end

      prev = rune
    end

    if stash != ""
      html += "<#{tag}>#{stash}</#{tag}>"
      stash = ""
    end

    return html

  end

end