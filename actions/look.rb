#!/bin/env ruby
# encoding: utf-8

module ActionLook

  def look q = nil

    return "#{look_head}#{look_note}#{look_visibles}#{look_hint}#{look_via}"

  end

  private

  def look_head

    return @actor.parent == @actor.id ? "~ The paradox of #{@actor.print.downcase}.\n\n".capitalize : "~ "+"#{@actor.print} in #{@actor.parent_vessel.print}.\n".capitalize

  end

  def look_note

    if !@actor.parent_vessel.note then return nil end
    
    note = @actor.parent_vessel.note
    note = note != "" ? "#{Wildcard.new(note).render}" : ""
    note = note.capitalize
    # Replace
    @actor.visible_vessels.each do |vessel|
      if !note.downcase.include?(vessel.name) then next end
      note = note.downcase.sub(" "+vessel.name," {{#{vessel.name}}}")
    end
    # Format
    note_formated = ""
    note.split("&").each do |line|
      line = line.strip
      line = line[line.length-1,1] != "." ? line+"." : line
      note_formated += "& "+line.gsub(". ",".\n").capitalize+"\n"
    end
    return note_formated.strip+"\n"

  end

  def look_visibles

    if @actor.visible_vessels.length < 1 then return nil end

    text = ""
    @actor.visible_vessels.each do |vessel|
      if @actor.parent_vessel.note.to_s.downcase.include?(vessel.name) then next end
      text += vessel.display
    end
    
    return text+"\n"

  end

  def look_hint

    return @actor.parent_vessel.hint

  end

  def look_via

    text = ""

    @actor.parent_vessel.parent_actions.available.each do |action|
      text += "@+ #{action}\n"
    end

    return text

  end

end