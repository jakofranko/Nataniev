#!/bin/env ruby
# encoding: utf-8

class Willw

  include Vessel

  def display q = nil

    return "- #{print.capitalize}, chirps a rhyme \"#{poem(q)}\".\n"

  end

  def poem q = nil

    @templates = createTemplates
    @usedWords = []
    @attempts  = 0

    @dict = dict

    targetTemplate = @templates.sample

    p = nil
    c = 0
    while !p
      if c > 100 then targetTemplate = @templates.sample ; c = 0 end
      p = generate(targetTemplate,q.to_s.strip)
      c += 1
    end

      p = p.gsub("A o", "An o")
      p = p.gsub("A a", "An a")
      p = p.gsub("A u", "An u")
      p = p.gsub("A e", "An e")
      p = p.gsub("A i", "An i")

      p = p.gsub("a a", "an a")
      p = p.gsub("a i", "an i")
      p = p.gsub("a u", "an u")
      p = p.gsub("a o", "an o")
      p = p.gsub("a e", "an e")

      p = p.gsub("a A", "an A")
      p = p.gsub("a I", "an I")
      p = p.gsub("a U", "an U")
      p = p.gsub("a O", "an O")
      p = p.gsub("a E", "an E")

      p = p.gsub("A A", "An A")
      p = p.gsub("A I", "An I")
      p = p.gsub("A U", "An U")
      p = p.gsub("A O", "An O")
      p = p.gsub("A E", "An E")

      p = p.gsub("a ha", "an ha")
      p = p.gsub("sss","ses")
      p = p.gsub!(/^\s*\w/){|match| match.upcase}

    return p

  end

  def generate template,query

    macros = template.scan(/(?:\{)([\w\W]*?)(?=\})/)

    if query.strip.split(" ").length > 0
      targ = query.strip.split(" ")
    else
      targ = [findTarget,findTarget,findTarget,findTarget,findTarget]
    end
    
      macros.each do |macro,v|

        type = macro[0,1]
        posi = macro[1,1]
        team = macro[2,1].to_i
        capi = type.capitalize == type ? true : false

        game = findWord(type,posi,targ[team-1])
        if game == nil then return nil end
        game = capi == true ? game.capitalize : game
        @usedWords.push(game.downcase)

        template = template.sub("{#{macro}}",game)
      end

    return template.strip

  end

  def findTarget

    word = nil
    while !word
      attempt = @dict["NOUN"].sample
      word = attempt.length > 5 ? attempt : nil
    end
    return word

  end

  def findWord type, posi, target

    if    type.downcase == "n" then type_name = "NOUN"
    elsif type.downcase == "v" then type_name = "VERB"
    elsif type.downcase == "a" then type_name = "ADJ"
    elsif type.downcase == "i" then type_name = "INTERROG"
    elsif type.downcase == "p" then type_name = "PREP"
    else return nil end

    @dict[type_name].shuffle.each do |word|
      if !word then next end
      if @usedWords.include?(word) then next end
      if word.length < 4 then next end
      if word.length > 9 then next end
      if posi == "=" && word == target then return word end
      if posi == "<" && word[0,3] == target[0,3] then return word end
      if posi == ">" && word[word.length-3,3] == target[target.length-3,3] then return word end
    end

    return nil

  end

  def dict

    word_type = ""

    dict = {}

    File.open("#{$nataniev_path}/library/encyclopedias/dictionary.en","r:UTF-8") do |f|
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

  def createTemplates

    templates = []

    # Simple
    templates.push("A {n<1} is {a>1}..")
    templates.push("{N<1}{n>1}?")
    templates.push("{V>1} all {N>1}s!")
    templates.push("{V<1} {N<1}")
    templates.push("The {A>1} {N<1}s")
    templates.push("{N<1}'s {N<1}")
    templates.push("{P<1} the {N<1}")

    # Intermediate
    templates.push("The {N>1}, a {a>1} {n>1}.")
    templates.push("A {N<1}, the {A<1} {N<1}.")
    templates.push("{N<1} {N=1} {N>1}.")
    templates.push("Of {A>1} & {A<1} {N=1}.")
    templates.push("In a {a<1} {n=1} by the {n>1}.")
    templates.push("Will the {n<1} {v<1} the {n<1}?")
    templates.push("The {N<1} of the {A>1} {N=1}")
    templates.push("A {n=1} {p>1} the {n<1}.")

    # Complex
    templates.push("{A<1} {N<1}, {A>1} {N>1}.") 
    templates.push("The {N<1}'s {a<1}, a {A>1} {N>1}.") 
    templates.push("O {N<1}! My {A<1} {A>1} {N=1}.")
    templates.push("{V<1} the {n>1}, {v<1} the {n>1}.")
    templates.push("{A>1} {N>1} VS {A>1} {N>1}")
    templates.push("{V<1} the {n<1}s. #\{a<1\}\{N<1\}")
    
      return templates

  end

end