#!/bin/env ruby
# encoding: utf-8

class String

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

    if macro[0,1] == "$" then return Nataniev.new.answer(macro[1,macro.length-1].strip) end
    if macro == "!clock" then return "<a href='/Desamber'>#{Desamber.new.clock}</a>" end
    if macro == "!desamber" then return "<a href='/Desamber'>#{Desamber.new}</a>" end

    if macro.include?("|")
      if macro.split("|")[1].include?("http") then return "<a href='"+macro.split("|")[1]+"' class='external'>"+macro.split("|")[0]+"</a>"
      else return "<a href='"+macro.split("|")[1]+"'>"+macro.split("|")[0]+"</a>" end
    end
    
    return "<a href='/#{macro.gsub(' ','+')}'>#{macro}</a>"

  end

  def has_badword

    ["dick","pussy","asshole","nigger","cock","jizz","faggot","nazi","cunt","sucker","bitch","fag","jew","nigga","anus","fuck"].each do |bad_word|
      if self.include?(bad_word) then return bad_word end
    end
    return nil

  end

  def is_alphabetic

    if self.gsub(/[^a-z]/i, '').downcase == self.downcase then return true end
    return nil

  end

end