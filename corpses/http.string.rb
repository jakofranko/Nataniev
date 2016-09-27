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

    if macro == "!clock" then return "<a href='/Clock'>#{Clock.new}</a>" end
    if macro == "!desamber" then return "<a href='/Desamber'>#{Desamber.new}</a>" end

    if macro.include?("|")
      if macro.split("|")[1].include?("http") then return "<a href='"+macro.split("|")[1]+"' class='external'>"+macro.split("|")[0]+"</a>"
      else return "<a href='"+macro.split("|")[1]+"'>"+macro.split("|")[0]+"</a>" end
    end
    
    return macro

  end

end