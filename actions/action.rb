#!/bin/env ruby
# encoding: utf-8

module Action

  private

  def find_present_vessel name

    name = " #{name} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").last.to_s.strip

    @actor.present_vessels.each do |v|
      if v.name.like(name) then return v end
    end

    return nil

  end

  def find_visible_vessel name

    name = " #{name} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").last.to_s.strip

    @actor.visible_vessels.each do |v|
      if v.name.like(name) then return v end
    end

    return nil

  end

  def find_inventory_vessel name

    name = " #{name} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").last.to_s.strip

    @actor.inventory_vessels.each do |v|
      if v.name.like(name) then return v end
    end

    return nil

  end

  def find_any_vessel name

    name = " #{name} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").last.to_s.strip

    candidates = []

    id = -1
    $nataniev.parade.to_a.each do |v|
      id += 1
      v = $nataniev.make_vessel(id)
      if v.name.like(name) then return candidates.push(v) end
    end

    return candidates.sample

  end


  def find_the_vessel name

    name = " #{name} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").last.to_s.strip

    id = -1
    $nataniev.parade.to_a.each do |v|
      id += 1
      v = $nataniev.make_vessel(id)
      if v.name.like(name) then return v end
    end

    return nil

  end

  def find_owned_vessel name

    name = " #{name} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").last.to_s.strip

    @actor.owned_vessels.each do |v|
      if v.name.like(name) then return v end
    end

    return nil

  end

  # Errors

  def error_command_invalid command ; return "? #{command} is not a valid command." end
  def error_command_banned bannedWord ; return "? Paradise does not allow the use of the word #{bannedWord}." end
  def error_locked vesselName ; return "? #{vesselName} is locked and cannot me modified." end
  def error_stem ; return "? #{parent_vessel.print.capitalize} is a paradox and cannot be exited." end
  def error_empty ; return "? You do not contain any vessel." end
  def error_target vesselId ; return vesselId.to_i > 0 ? "? There are no accessible vessels at ##{vesselId}" : "? There is no visible vessel named #{vesselId}." end
  def error_program_invalid vesselName ; return "? #{vesselName} does not have a valid program." end
  def error_program_denied program ; return "? #{program} is not a valid program." end
  def error_clone vesselName, clone = nil ; return clone ? "? #{vesselName} already exists at the #{clone.name}|warp to #{clone.id}." : "#{vesselName} already exists here." end
  def error_owner vesselName ; return "? You do not own #{vesselName}." end
  def error_frozen vesselName ; return "? Your #{vesselName} vessel is frozen and cannot act." end
  def error_estate distance ; return "? Sorry, paradise does not have any more estate|help estate for new vessels." end
  def error_id id ; return "? ##{id} is not a valid warp id." end
  def error_hidden vesselName ; return "? The #{vesselName} is hidden and inaccessible." end
  def error_random ; return "? A strange event occured, try again." end

end

module ActionCollection

  def initialize actor

    @actor = actor

  end

  def available
    
    return methods - Object.methods - [:available]

  end

end