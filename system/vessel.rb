#!/bin/env ruby
# encoding: utf-8

require 'date'

Dir["#{$paradise_path}/vessels/*"].each do |file_name|
  load(file_name)
  puts "loaded #{file_name}"
end

module Vessel

  def initialize id = 0,line = {}

    @id = id.to_i
    @line = line

    @code = @line['CODE'] ? @line['CODE'].split("-") : "1111-00000-00000-00000-20160101010101"

    @permissions = @code[0]
    @isLocked    = permissions[0,1].to_i
    @isHidden    = permissions[1,1].to_i
    @isQuiet     = permissions[2,1].to_i
    @isFrozen    = permissions[3,1].to_i

    @parent = @code[1].to_i
    @owner  = @code[2].to_i
    @instance = @code[3].to_s
    @timestamp = @code[4].to_i

    @name = @line['NAME'] ? @line['NAME'] : "voidspace"
    @attribute = @line['ATTR'] ? @line['ATTR'] : ""
    @program = @line['PROGRAM'] ? @line['PROGRAM'] : ""
    @note = @line['NOTE'] ? @line['NOTE'] : ""

  end

  #

  def id ; return @id end
  def permissions ; return @permissions end

  def code ; return "#{isLocked.to_i}#{isHidden.to_i}#{isQuiet.to_i}#{isFrozen.to_i}-#{parent.to_s.prepend("0",5)}-#{owner.to_s.prepend("0",5)}-#{instance.to_s.prepend("0",5)}-#{timestamp.to_s}" end

  def isLocked ; return @isLocked.to_i == 1 ? 1 : nil end
  def isHidden ; return @isHidden.to_i == 1 ? 1 : nil end
  def isQuiet ; return @isQuiet.to_i == 1 ? 1 : nil end
  def isFrozen ; return @isFrozen.to_i == 1 ? 1 : nil end

  def parent ; return @parent end
  def owner ; return @owner end
  def instance ; return @instance end
  def timestamp ; return @timestamp end

  def name ; return @name end
  def attribute ; return @attribute.to_s != "" ? @attribute : nil end
  def program ; return Program.new(@program) end
  def note ; return @note.to_s != "" ? @note : nil end

  def now ; return DateTime.parse(Time.now.to_s).strftime("%Y%m%d%H%M%S") end

  #

  def setLock val ; @isLocked = val ; @timestamp = now end
  def setHide val ; @isHidden = val ; @timestamp = now end
  def setQuiet val ; @isQuiet = val ; @timestamp = now end

  def setName val ; @name = val ; @timestamp = now end
  def setAttribute val ; @attribute = val ; @timestamp = now end
  def setParent val ; @parent = val ; @timestamp = now end
  def setProgram val ; @program = val ; @timestamp = now end
  def setNote val ; @note = val ; @timestamp = now end

  def destroy

    @isDestroyed = true

  end

  # Actions

  def isEnterAllowedFor vessel

    return true # TODO!

  end

  def isUseAllowedFor vessel

    return true # TODO!

  end

  def isCallAllowedFor vessel

    return true

  end

  # Prints

  def icon

    if isFrozen then return "~" end
    if isLocked then return "*" end
    if isHidden then return "•" end
    if isQuiet then return "^" end
    if program.isValid then return "`" end
    return ""

  end

  def print

    _article   = program.isValid || note || isFrozen ? "the " : "a "
    _article   = owner == ($player && $player.id) ? "your " : _article
    _attribute = attribute.to_s != "" ? "#{attribute} " : ""
    _name      = name
    _icon      = "" # icon
    result     = _article+_attribute+_name+_icon
  
    return result.downcase.sub("a o","an o").sub("a u","an u").sub("a e","an e")

  end

  def display_for player,inventory

    rune = program.isValid ? "=" : "-"
    echo = program.echo_for(player,inventory) 
    return rune+" "+print.capitalize+(echo.to_s != "" ? ", "+echo : "" )+"\n"

  end

  def hint

    if !isLocked || owner == $player.id
      if !attribute then return "Add an adjective to {{#{print}}} by {{renaming|rename}} it." end
      if !note then return "Add a {{Note}} to describe {{#{print}}}." end
      if !program.isValid then return "Add a {{Program}} to interact with {{#{print}}}." end
    end
    return nil

  end

  def debug

    return "##{id.to_s.append(" ",5)} #{name.to_s.append(" ",15)}:#{attribute.to_s.append(" ",15)} #{permissions.to_s} [#{program.debug.append(" ",80)}] / #{note.to_s[0,30]}\n"

  end

  def render

    return @isDestroyed == true ? "" : "#{code} #{name.to_s.append(" ",14)} #{attribute.to_s.append(" ",14)} #{program.to_s.append(" ",80)} #{note}"

  end

  def to_hash

    return {"CODE"=>code, "NAME"=>name, "ATTR"=>attribute, "PROGRAM"=>program.to_s, "NOTE"=>note.to_s}

  end

  def rank

    rank = 0

    if attribute then rank += 1 end
    if note then rank += 1 end
    if note && note.to_s.length > 20 then rank += 2 end
    if program.isValid then rank += 1 end

    if parent == id then rank += 1 end

    if isLocked then rank += 2 end
    if isHidden then rank += 1 end
    if isQuiet then rank += 1 end

    if isFrozen then rank += 2 end
  
    return rank

  end

  def save
    
    $parade.world.save(id,render)

  end

end