#!/bin/env ruby
# encoding: utf-8

load "#{$paradise_path}/library/di.parser.rb"

load "#{$paradise_path}/system/vessel.rb"
load "#{$paradise_path}/system/program.rb"
load "#{$paradise_path}/system/wildcard.rb"
load "#{$paradise_path}/system/parade.actions.rb"

load "#{$paradise_path}/system/tools.rb"

load "#{$paradise_path}/vessels/russe.rb"
load "#{$paradise_path}/vessels/basic.rb"
load "#{$paradise_path}/vessels/ghost.rb"

$action_dictionary =
{
  # Main
  "look" => ["PLAYER"],
  "connect" => ["PLAYER"],
  # Core
  "create" => ["PLAYER"],
  "become" => ["PLAYER","VISIBLE"],
  "enter" => ["PLAYER","VISIBLE"],
  "leave" => ["PLAYER","PARENT.PARENT"],
  # Intermediate
  "warp" => ["PLAYER","ID"]
}

class Paradise

  def initialize id

    @id = id.to_i
    refresh

  end

  def timestamp ; return DateTime.parse(Time.now.to_s).strftime("%Y%m%d%H%M%S") end

  def world ; return @world end
  def player ; return @player end
  def parent ; return @parent end

  def presence ; return @presence end
  def visible ; return @visible end
  def inventory ; return @inventory end

  def refresh

    @world  = Di.new.application("paradise")
    @player = cast(@id,@world.line(@id))
    @parent = cast(@player.parent,@world.line(@player.parent))
    @presence = loadPresence
    @visible = loadVisible
    @inventory = loadInventory

    $player = @player
    $parent = @parent

  end

  def act command = "look"

    refresh

    if command == "" then command = "look" end

    action = command.split(" ").first.strip
    params = command.sub(action,"").strip

    active = action_dictionary_parser($action_dictionary[action][0])
    target = action_dictionary_parser($action_dictionary[action][1],params)

    if isBanned(command)           then return eror_command_banned(isBanned(command)) end
    if !$action_dictionary[action] then return eror_command_invalid(command) end
    # if active.isFrozen             then return eror_frozen(active.name) end
    # if active.isLocked             then return "NOPE" end
    if !active.respond_to?(action) then return eror_command_invalid(action) end

    return active.send(action,target).strip
    
  end

  def action_dictionary_parser handle, value = nil

    warp_id = value ? value.split(" ").last : 0

    case handle
    when "PLAYER"
      return @player
    when "PARENT"
      return @parent
    when "PARENT.PARENT"
      return vesselWithId(@world,@parent.parent)
    when "VISIBLE"
      return vesselWithName(@visible,value)
    when "ID"
      return vesselWithId(@world,warp_id)
    end

  end

  def loadPresence

    array = []
    id = -1
    @world.to_a.each do |line|
      id += 1
      if id == @player.id then next end
      if !line['CODE'] then next end
      if line['CODE'][5,5].to_i == @parent.id then array.push(cast(id,line))  # Around
      elsif line['CODE'][5,5].to_i == @player.id then array.push(cast(id,line)) end # Inventory
    end
    return array

  end

  def loadVisible

    array = []
    @presence.each do |vessel|
      if vessel.id == @parent.id then next end
      if vessel.parent != @parent.id then next end
      if vessel.owner == @player.id then array.push(vessel)             # Is owner
      elsif @parent.isQuiet && vessel.owner == @parent.owner then array.push(vessel)  # Quiet Parent
      elsif !@parent.isQuiet then array.push(vessel)                  # Default
      end
    end
    return array

  end

  def loadInventory

    array = []
    @presence.each do |vessel|
      if vessel.parent != @player.id then next end
      array.push(vessel)
    end
    return array

  end

  # Seek

  def vesselWithName source, name

    name = simplify(name)
    name = name.include?(" ") ? name.split(" ").last : name
    source.each do |vessel|
      if !vessel.name.like(name) then next end
      return vessel
    end
    return nil

  end

  def vesselWithNameAndAttribute source, name, attribute

    source.each do |v|
      vessel = cast(0,v)
      if !vessel.name.to_s.like(name) then next end
      if !vessel.attribute.to_s.like(attribute) then next end
      return vessel
    end
    return nil

  end

  def vesselWithId source = @world, id

    return cast(id.to_i,source.line(id.to_i))

  end

  # Tools

  def availableId

    count = 0
    File.open("#{$paradise_path}/library/dictionaries/paradise.di","r:UTF-8") do |f|
      f.each_line do |line|
        count += 1
        if count < 100 then next end
        if line.strip != "" then next end
        return count-7
      end
    end
    return count-6

  end

  def simplify name

    return " #{name} ".sub(" a ","").sub(" an ","").sub(" the ","").strip

  end

  def isBanned string

      ["dick","cock","pussy","nigga","faggot","shit","fuck","boring","nigger","rolf","wtf","cunt","douche","poop","bitch","dildo","sperm","bitches","fuuck","asshole","fag","hoe","fat chicks","lulz","trololo","abcde","erection","adsf","asdf","jizz","ballsack","hooker","hitler"].each do |badWord|
        if string.include?(badWord) then return badWord end
      end
      return nil

  end

  def completion

    hash = {}
      hash["test"] = "something"
      return hash

  end

  def cast id, line

    type = line['CODE'].split("-")[3]
    if type == "RUSSE" then return Russe.new(id,line) end
    return Basic.new(id,line)

  end

  def eror_command_invalid command ; return "#{command} is not a valid command." end
  def eror_command_banned bannedWord ; return "Paradise does not allow the use of the word {{#{bannedWord}}}." end
  def eror_locked vesselName ; return "{{#{vesselName}}} is locked and cannot me modified." end
  def eror_stem vesselName ; return "{{#{vesselName}}} is a paradox and cannot be exited." end
  def eror_target vesselId ; return vesselId.to_i > 0 ? "There are no accessible vessels at ##{vesselId}" : "There is no visible vessel named {{#{vesselId}}}." end
  def eror_program_invalid vesselName ; return "{{#{vesselName}}} does not have a valid program." end
  def eror_program_denied program ; return "{{#{program}}} is not a valid program." end
  def eror_clone vesselName, clone = nil ; return clone ? "{{#{vesselName}}} already exists at the {{#{clone.name}|warp to #{clone.id}}}." : "{{#{vesselName}}} already exists here." end
  def eror_owner vesselName ; return "You do not own {{#{vesselName}}}." end
  def eror_frozen vesselName ; return "Your {{#{vesselName}}} vessel is frozen and cannot act." end
  def eror_estate distance ; return "Sorry, paradise does not have any more {{estate|help estate}} for new vessels." end
  def eror_id id ; return "##{id} is not a valid warp id." end

end