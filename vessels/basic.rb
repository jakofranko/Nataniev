#!/bin/env ruby
# encoding: utf-8

class Basic

  include Vessel

  # Setters

  def set_lock      val ; if owner != $nataniev.actor.id then return false end ; @is_locked = val ; save ;  return true end
  def set_hide      val ; if owner != $nataniev.actor.id then return false end ; @is_hidden = val ; save ;  return true end
  def set_quiet     val ; if owner != $nataniev.actor.id then return false end ; @is_quiet = val ; save ;   return true end

  def set_name      val ; if is_locked then return false end ; @name = val ; save ;      return true end
  def set_attribute val ; if is_locked then return false end ; @attribute = val ; save ; return true end
  def set_parent    val ; if is_locked then return false end ; @parent = val ; save ;    return true end
  def set_program   val ; if is_locked then return false end ; @program = val ; save ;   return true end
  def set_note      val ; if is_locked then return false end ; @note = val ; save ;      return true end

  def destroy ; @isDestroyed = true ; save ; end

  def actions ; return Actions.new(self) end

  class Actions

    include ActionCreate
    include ActionBecome
    include ActionEnter
    include ActionLeave

    include ActionWarp

    include ActionTakeDrop
    include ActionShowHide
    include ActionLockUnlock

    include ActionInventory
    include ActionHelp

    def initialize actor

      @actor = actor

    end

  end


  #: Narative

  def via__note q = nil

    return parent_vessel.set_note(q) ? "! You added a note to #{parent_vessel.print}." : "! The #{parent_vessel.name} cannot be modified."
    
  end

  def via__name q = nil

    name = q.split(" ").last

    if name.length > 14 then return "! Names cannot exceed 14 characters in length." end

    return parent_vessel.set_name(name) ? "! You named the #{parent_vessel.name}, a #{name}." : "! You cannot rename the #{parent_vessel.name}."
    
  end

  def via__make q = nil

    attribute = q.split(" ").last

    if attribute.length > 14 then return "! Attributes cannot exceed 14 characters in length." end

    return parent_vessel.set_attribute(attribute) ? "! You made the #{parent_vessel.name}, #{attribute}." : "! You cannot define the #{parent_vessel.name}."
    
  end

  #: Programming

  def via__program q = nil

    return "! TODO"
    
  end

  # Destruction

  def vis__destroy q = nil

    v = find_present_vessel(q) ; if !v then return error_target(q) end

    if v.owner != id then return error_owner end

    return v.destroy ? "! You destroyed the #{v.name}." : "! You cannot destroy the #{v.name}."

  end

  def vis__purge q = nil

    return "! TODO"
    
  end

  #: Lookups

  def __find q = nil 

    if q.split(" ").first == "my"
      vessel = find_owned_vessel(q.sub("my ",''))
    else q.split(" ").first == "the"
      vessel = find_any_vessel(q.sub("my ",''))
    end

    if !vessel then return "! There are no vessel named \"#{q}\"." end
    if vessel.is_hidden then return "! The #{vessel.print} is hidden and cannot be located." end

    return "! {{#{vessel.print.capitalize}}} is located at #{vessel.parent}."

  end

  #: System

  def __sonar q = nil # Returns details about the parent location, its depth and the universe.

    tries = 0
    parent = @parent
    while tries < 100
      code = $nataniev.parade.to_a[parent]["CODE"]
      if parent == code[5,5].to_i 
        if tries == 0
          return "! You are in the #{parent_vessel.name} ##{@parent}, at the stem of #{$nataniev.make_vessel(parent).print} universe."
        else
          return "! You are in the #{parent_vessel.name} ##{@parent}, #{tries} levels deep, within the #{$nataniev.make_vessel(parent).print} universe." 
        end
      end
      parent = code[5,5].to_i
      tries += 1
    end

    return "! You are in the #{parent_vessel.name}(##{@parent}), within a circular paradox."

  end

  #: WIP

  def __poke q = nil ; return __use(q) end

  def vis__use q = nil

    name = " #{q} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").first.to_s.strip

    v = find_visible_vessel(name) ; if !v then return error_target(name) end

    params = q.split(v.name) ; params[0] = nil

    return v.use(params.join.strip)
    
  end

  def __call q = nil

    if q.to_i < 1 then return error_id(q) end

    return $nataniev.make_vessel(q.to_i).use
    
  end

  def vis__inspect q = nil

    return "! TODO"
    
  end

end