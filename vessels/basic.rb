#!/bin/env ruby
# encoding: utf-8

class Basic

  include Vessel

  # System

  def __connect q = nil

    return "#{print.capitalize} is online."

  end

  def __look q = nil

    return "#{look_head}#{look_note}#{look_visibles}#{look_hint}"

  end

  # Basic

  def __create q = nil

    return "TODO[create]"
    
  end

  def __become q = nil

    return "TODO"
    
  end

  def __enter q = nil

    v = find_visible_vessel(q) ; if !v then return error_target(q) end

    set_parent(v.id)

    return "You entered #{v.print}."
    
  end

  def __leave q = nil

    if @parent == parent_vessel.parent then return error_stem end

    set_parent(parent_vessel.parent)

    return "You left #{parent_vessel.print}."
    
  end

  # Narative

  def __note q = nil

    parent_vessel.set_note(q)

    return "You added a note to #{parent_vessel.print}."
    
  end

  def __rename q = nil

    return "TODO"
    
  end

  # Warp

  def __warp q = nil

    q = q.sub("to ","").to_i
    v = $nataniev.make_vessel(q.to_i) ; if !v then return error_target(q) end

    set_parent(v.id)

    return "You warped to #{v.print}."
    
  end

  def __random q = nil

    return "TODO"
    
  end

  # Inventory

  def __inventory q = nil

    return "TODO"
    
  end

  def __take q = nil

    v = find_visible_vessel(q) ; if !v then return error_target(q) end

    v.set_parent(@id)

    return "You took #{v.print}."
    
  end

  def __drop q = nil

    v = find_inventory_vessel(q) ; if !v then return error_target(q) end

    v.set_parent(@parent)

    return "You dropped #{v.print}."
    
  end

  # Programming

  def __program q = nil

    return "TODO"
    
  end

  def __use q = nil

    v = find_visible_vessel(q) ; if !v then return error_target(q) end

    params = q.split(v.name) ; params[0] = nil

    return v.use(params.join.strip)
    
  end

  def __call q = nil

    if q.to_i < 1 then return error_id end

    return $nataniev.make_vessel(q.to_i).use
    
  end

  def __inspect q = nil

    return "TODO"
    
  end

  # Security

  def __lock q = nil

    v = find_present_vessel(q) ; if !v then return error_target(q) end

    v.set_lock(1)

    return "You locked #{v.print}."
    
  end

  def __unlock q = nil

    v = find_present_vessel(q) ; if !v then return error_target(q) end
    
    v.set_lock(0)

    return "You unlocked #{v.print}."
    
  end

  def __show q = nil

    v = find_present_vessel(q) ; if !v then return error_target(q) end
    
    v.set_hide(0)

    return "You revealed #{v.print}."
    
  end

  def __hide q = nil

    v = find_present_vessel(q) ; if !v then return error_target(q) end
    
    v.set_hide(1)

    return "You hid #{v.print}."
    
  end

  # Destruction

  def __destroy q = nil

    return "TODO"

  end

  def __purge q = nil

    return "TODO"
    
  end

  # Locate

  def __where q = nil

    return @parent.to_s

  end

  def __sonar q = nil

    tries = 0
    parent = @parent
    while tries < 100
      code = $nataniev.parade.to_a[parent]["CODE"]
      if parent == code[5,5].to_i then return "You are #{tries} levels deep, in #{$nataniev.make_vessel(parent).print} universe." end
      parent = code[5,5].to_i
      tries += 1
    end

    return "You are in a circular paradox."

  end

end