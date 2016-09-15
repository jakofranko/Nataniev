#!/bin/env ruby
# encoding: utf-8

module ActionHelp

  def help q = nil

    text = "& Help for the #{self.class.name} vessel:\n\n"

    player_commands = []
    (self.methods - Object.methods).sort.each do |method|
      if method[0,2] != "__" then next end
      puts method
      # parent_commands.push(method.to_s.sub("via__",""))
    end


    parent_commands = []
    (parent_vessel.methods - Object.methods).sort.each do |method|
      if method[0,5] != "via__" then next end
      parent_commands.push(method.to_s.sub("via__",""))
    end

    puts self.actions.methods

    return "?"

    lines = File.read("#{$nataniev_path}/vessels/#{self.class.name.downcase}.rb", :encoding => 'UTF-8').split("\n")

    content = []
    lines.each do |line|

      if line.strip[0,6] == "def __"
        action = line.split(" ")[1].to_s.gsub("__","")
        documentation = line.include?("#") ? line.split("#").last.strip : "Missing documentation"
        text += "- "+"{{#{action}}}".append(" ",15)+" #{documentation}\n"
      end

      if line.strip[0,3] == "#: "
        text += "# #{line.sub('#: ','').strip}\n"
      end
      
    end

    return text

  end

end