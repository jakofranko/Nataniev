#!/bin/env ruby
# encoding: utf-8

class Disms

  include Vessel

  def word

    timeDiff  = Time.new.to_i - Date.new(2015,8,21).to_time.to_i
    daysGone  = (timeDiff/86400)
    chapter   = (daysGone * 24) + Time.now.hour

    word = dict["NOUN"][chapter % dict["NOUN"].length]

    # -te
    if word[-2,2] == "te"
      word = word[0...-1]+"ism"
    # -ve
    elsif word[-2,2] == "ve"
      word = word[0...-1]+"ism"
    # -ly
    elsif word[-2,2] == "ly"
      word = word+"ism"   
    # -ed
    elsif word[-2,2] == "ed"
      word = word[0...-2]+"ism"
    # -ist
    elsif word[-3,3] == "ist"
      word = word[0...-3]+"ism"
    # -y
    elsif word[-1,1] == "y"
      word = word[0...-1]+"ism"
    else
      word += "ism"
    end

    return word.capitalize

  end

  def dict

    word_type = ""

    dict = {}

    File.open("#{$nataniev.path}/library/encyclopedias/dictionary.en","r:UTF-8") do |f|
      f.each_line do |line|
        depth = line[/\A */].size
        line = line.strip
        if depth == 0
          word_type = line
        else
          if !dict[word_type] then dict[word_type] = [] end
          dict[word_type].push(line)
        end
      end
    end

    return dict

  end

end