#!/bin/env ruby
# encoding: utf-8

require 'date'

# Dir["#{$nataniev_path}/vessels/*"].each do |file_name|
#   load(file_name)
# end

load "#{$nataniev_path}/system/wildcard.rb"
load "#{$nataniev_path}/system/program.rb"

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

  # Accessors

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

  # Slow Accessors

  def parent_vessel ; !@parent_vessel ? @parent_vessel = load_parent_vessel : @parent_vessel ; return @parent_vessel end
  def present_vessels ; !@present_vessels ? @present_vessels = load_present_vessels : @present_vessels ; return @present_vessels end
  def visible_vessels ; !@visible_vessels ? @visible_vessels = load_visible_vessels : @visible_vessels ; return @visible_vessels end
  def inventory_vessels ; !@inventory_vessels ? @inventory_vessels = load_inventory_vessels : @inventory_vessels ; return @inventory_vessels end

  # Setters

  def set_lock val ; @isLocked = val ; save end
  def set_hide val ; @isHidden = val ; save end
  def set_quiet val ; @isQuiet = val ; save end

  def set_name val ; @name = val ; save end
  def set_attribute val ; @attribute = val ; save end
  def set_parent val ; @parent = val ; save end
  def set_program val ; @program = val ; save end
  def set_note val ; @note = val ; save end

  # Loaders

  def load_parent_vessel

    return $nataniev.make_vessel(@parent)

  end

  def load_present_vessels

    array = []
    id = -1
    $nataniev.parade.to_a.each do |line|
      id += 1 ; 
      if !line['CODE'] then next end
      if line['CODE'][5,5].to_i != parent && line['CODE'][5,5].to_i != id then next end
      array.push($nataniev.make_vessel(id))
    end
    return array

  end

  def load_visible_vessels

    array = []
    id = -1
    $nataniev.parade.to_a.each do |line|
      id += 1 ; 
      if id == @id then next end                         # Self
      if id == @parent then next end                     # Parent
      if !line['CODE'] then next end
      if line['CODE'][5,5].to_i != parent then next end
      if parent_vessel.isQuiet && line['CODE'][11,5].to_i != parent_vessel.owner then next end
      array.push($nataniev.make_vessel(id))
    end
    return array

  end

  def load_inventory_vessels

    array = []
    id = -1
    $nataniev.parade.to_a.each do |line|
      id += 1 ; 
      if id == @id then next end
      if !line['CODE'] then next end
      if line['CODE'][5,5].to_i != @id then next end
      array.push($nataniev.make_vessel(id))
    end
    return array

  end

  # Targetting

  def find_present_vessel name

    name = " #{name} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").first.to_s.strip

    present_vessels.each do |v|
      if v.name.like(name) then return v end
    end

    return nil

  end

  def find_visible_vessel name

    name = " #{name} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").first.to_s.strip

    visible_vessels.each do |v|
      if v.name.like(name) then return v end
    end

    return nil

  end

  def find_inventory_vessel name

    name = " #{name} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").first.to_s.strip

    inventory_vessels.each do |v|
      if v.name.like(name) then return v end
    end

    return nil

  end

  def destroy

    @isDestroyed = true

  end

  def use q = nil

    if !program.isValid then return "Nothing happens." end
    return program.run

  end

  # Prints

  def print

    _article   = program.isValid || note || isFrozen ? "the " : "a "
    _article   = owner == ($player && $player.id) ? "your " : _article
    _attribute = attribute.to_s != "" ? "#{attribute} " : ""
    _name      = name
    _icon      = "" # icon
    result     = _article+_attribute+_name+_icon
  
    return result.downcase.sub("a o","an o").sub("a u","an u").sub("a e","an e").sub("a i","an i").sub("a hy","an hy")

  end

  def display

    rune = program.isValid ? "=" : "-"
    echo = program.echo
    return rune+" "+print.capitalize+(echo.to_s != "" ? ", "+echo : "" )+"\n"

  end

  def hint

    if !isLocked || owner == $nataniev.player.id
      if !attribute then return "Add an adjective to #{print} by renaming|rename it." end
      if !note then return "Add a Note to describe #{print}." end
      if !program.isValid then return "Add a Program to interact with #{print}." end
    end
    return nil

  end

  def render

    return @isDestroyed == true ? "" : "#{code} #{name.to_s.append(" ",14)} #{attribute.to_s.append(" ",14)} #{program.to_s.append(" ",80)} #{note}"

  end

  def save
    
    @timestamp = now
    $nataniev.parade.save(id,render)

  end

  # Look

  def look_head

    return parent == id ? "~ The paradox of "+"#{print}.\n\n".capitalize : "~ "+"#{print} in #{parent_vessel.print}.\n\n".capitalize

  end

  def look_note

    if !parent_vessel.note then return nil end
    
    note = parent_vessel.note
    note = note != "" ? "#{Wildcard.new(note).render}" : ""
    note = note.capitalize
    # Replace
    visible_vessels.each do |vessel|
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
    return note_formated.strip+"\n\n"

  end

  def look_visibles

    if visible_vessels.length < 1 then return nil end

    text = ""
    visible_vessels.each do |vessel|
      if parent_vessel.note.to_s.downcase.include?(vessel.name) then next end
      text += vessel.display
    end
    
    return text+"\n\n"

  end

  def look_hint

    return parent_vessel.hint

  end

  # Possible

  def completion

    cmds = []
    visible_vessels.each do |vessel|
      cmds.push("enter the #{vessel.name}")  
    end
    
    return cmds

  end

  # Errors

  def error_command_invalid command ; return "#{command} is not a valid command." end
  def error_command_banned bannedWord ; return "Paradise does not allow the use of the word #{bannedWord}." end
  def error_locked vesselName ; return "#{vesselName} is locked and cannot me modified." end
  def error_stem ; return "#{parent_vessel.print.capitalize} is a paradox and cannot be exited." end
  def error_target vesselId ; return vesselId.to_i > 0 ? "There are no accessible vessels at ##{vesselId}" : "There is no visible vessel named #{vesselId}." end
  def error_program_invalid vesselName ; return "#{vesselName} does not have a valid program." end
  def error_program_denied program ; return "#{program} is not a valid program." end
  def error_clone vesselName, clone = nil ; return clone ? "#{vesselName} already exists at the #{clone.name}|warp to #{clone.id}." : "#{vesselName} already exists here." end
  def error_owner vesselName ; return "You do not own #{vesselName}." end
  def error_frozen vesselName ; return "Your #{vesselName} vessel is frozen and cannot act." end
  def error_estate distance ; return "Sorry, paradise does not have any more estate|help estate for new vessels." end
  def error_id id ; return "##{id} is not a valid warp id." end

end