#!/bin/env ruby
# encoding: utf-8

class Array

  def runes_collection

    return {
      "&" => {"tag" => "p"},
      "-" => {"tag" => "list", "stash" => true},
      "#" => {"tag" => "code", "stash" => true},
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

      if rune == "%" then html += Media.new("generic",text).to_s ; next end
      if rune == "$" then html += (n = Nataniev.new ; n.start ; n.answer(text) ) ; next end

      if stash != "" && rune != prev
        prev_tag = collection[prev]["tag"]
        html += "<#{prev_tag}>#{stash}</#{prev_tag}>"
        stash = ""
      end

      if collection[rune] && collection[rune]["stash"]
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