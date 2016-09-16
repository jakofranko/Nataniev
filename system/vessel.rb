#!/bin/env ruby
# encoding: utf-8

require 'date'

load "#{$nataniev_path}/system/wildcard.rb"
load "#{$nataniev_path}/system/program.rb"

Dir["#{$nataniev_path}/actions/*"].each do |file_name|
  require file_name
end

module Vessel

  def initialize id = 0,line = {}

    @id = id.to_i
    @line = line

    @code = @line['CODE'] ? @line['CODE'].split("-") : "0000-00000-00000-00000-20160101010101"

    @permissions = @code[0]
    @is_locked    = permissions[0,1].to_i
    @is_hidden    = permissions[1,1].to_i
    @is_quiet     = permissions[2,1].to_i
    @is_frozen    = permissions[3,1].to_i

    @parent = @code[1].to_i
    @owner  = @code[2].to_i
    @instance = @code[3].to_s
    @timestamp = Timestamp.new(@code[4])

    @name = @line['NAME'] ? @line['NAME'] : "voidspace"
    @attribute = @line['ATTR'] ? @line['ATTR'] : ""
    @program = @line['PROGRAM'] ? @line['PROGRAM'] : ""
    @note = @line['NOTE'] ? @line['NOTE'] : ""

  end

  # Accessors

  def id ; return @id end
  def permissions ; return @permissions end

  def code ; return "#{is_locked.to_i}#{is_hidden.to_i}#{is_quiet.to_i}#{is_frozen.to_i}-#{parent.to_s.prepend("0",5)}-#{owner.to_s.prepend("0",5)}-#{instance.to_s.prepend("0",5)}-#{timestamp.to_s}" end

  def is_locked ; return @is_locked.to_i == 1 ? 1 : nil end
  def is_hidden ; return @is_hidden.to_i == 1 ? 1 : nil end
  def is_quiet ; return @is_quiet.to_i == 1 ? 1 : nil end
  def is_frozen ; return @is_frozen.to_i == 1 ? 1 : nil end

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

  def parent_vessel     ; !@parent_vessel ? @parent_vessel = load_parent_vessel : @parent_vessel ; return @parent_vessel end
  def present_vessels   ; !@present_vessels ? @present_vessels = load_present_vessels : @present_vessels ; return @present_vessels end
  def visible_vessels   ; !@visible_vessels ? @visible_vessels = load_visible_vessels : @visible_vessels ; return @visible_vessels end
  def inventory_vessels ; !@inventory_vessels ? @inventory_vessels = load_inventory_vessels : @inventory_vessels ; return @inventory_vessels end
  def owned_vessels     ; !@owned_vessels ? @owned_vessels = load_owned_vessels : @owned_vessels ; return @owned_vessels end

  # Setters

  def set_lock val = nil        ; return nil end
  def set_hide val = nil        ; return nil end
  def set_quiet val = nil       ; return nil end

  def set_name val = nil        ; return nil end
  def set_attribute val = nil   ; return nil end
  def set_parent val = nil      ; return nil end
  def set_program val = nil     ; return nil end
  def set_notereturn val = nil  ; return nil end

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
      if parent_vessel.is_quiet && line['CODE'][11,5].to_i != parent_vessel.owner && line['CODE'][11,5].to_i != $nataniev.actor.id then next end
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

  def load_owned_vessels

    array = []
    id = -1
    $nataniev.parade.to_a.each do |line|
      id += 1 ; 
      if id == @id then next end
      if !line['CODE'] then next end
      if line['CODE'][11,5].to_i != @id then next end
      array.push($nataniev.make_vessel(id))
    end
    return array

  end

  def render

    return @isDestroyed == true ? "" : "#{code} #{name.to_s.append(" ",14)} #{attribute.to_s.append(" ",14)} #{program.to_s.append(" ",80)} #{note}"

  end

  # TODO

  class Actions
    include ActionCollection
  end

  class ParentActions
    include ActionCollection
  end

  class TargetActions
    include ActionCollection
  end

  class DefaultActions
    include ActionCollection
    include ActionHelp
    include ActionExamine
  end

  def actions ; return Actions.new(self) end
  def parent_actions ; return ParentActions.new(self) end
  def target_actions ; return TargetActions.new(self) end
  def default_actions ; return DefaultActions.new(self) end

  def all_actions

    cmds = []

    actions.available.each do |action| cmds.push("#{action}") end
    default_actions.available.each do |action| cmds.push("#{action}") end
    parent_actions.available.each do |action| cmds.push("#{action}") end
      
    visible_vessels.each do |v|
      v.target_actions.available.each do |action| cmds.push("#{action} the #{v.name}") end
    end
    
    return cmds

  end

  # Prints

  def print

    _article   = program.is_valid || note || is_frozen ? "the " : "a "
    _article   = owner == ($player && $player.id) ? "your " : _article
    _attribute = attribute.to_s != "" ? "#{attribute} " : ""
    _name      = name
    _icon      = "" # icon
    result     = _article+_attribute+_name+_icon
  
    return result.downcase.sub("a o","an o").sub("a u","an u").sub("a e","an e").sub("a i","an i").sub("a hy","an hy").sub("a ho","an ho")

  end

  def display

    rune = program.is_valid ? "=" : "-"
    echo = program.echo
    return rune+" "+print.capitalize+(echo.to_s != "" ? ", "+echo : "" )+"\n"

  end

  def hint

    if !is_locked || owner == $nataniev.actor.id
      if !attribute then return "? Add an adjective to #{print} by renaming it.\n" end
      if !note then return "? Add a Note to describe #{print}.\n" end
      if !program.is_valid then return "? Add a Program to interact with #{print}.\n" end
    end
    return nil

  end

  def save
    
    @timestamp = Timestamp.new
    $nataniev.parade.save(id,render)

  end

  def rating

    v = 0

    if name.length > 3 then v += 1 end
    if attribute.to_s.length > 3 then v += 1 end
    if program.is_valid then v += 1 end
    if note.to_s.length > 30 then v += 1 end
    if timestamp.elapsed < 80000 then v += 1 end
    if is_locked then v += 1 end
    if is_quiet then v += 1 end
    if is_hidden then v += 1 end
    if is_frozen then v += 1 end
    if owned_vessels.length > 5 then v += 1 end

    return v

  end

end