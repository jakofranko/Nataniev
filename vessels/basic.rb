#!/bin/env ruby
# encoding: utf-8

class Basic

  include Vessel

  # Setters

  def set_lock      val ; if owner != $nataniev.player.id then return false end ; @is_locked = val ; save ;  return true end
  def set_hide      val ; if owner != $nataniev.player.id then return false end ; @is_hidden = val ; save ;  return true end
  def set_quiet     val ; if owner != $nataniev.player.id then return false end ; @is_quiet = val ; save ;   return true end

  def set_name      val ; if is_locked then return false end ; @name = val ; save ;      return true end
  def set_attribute val ; if is_locked then return false end ; @attribute = val ; save ; return true end
  def set_parent    val ; if is_locked then return false end ; @parent = val ; save ;    return true end
  def set_program   val ; if is_locked then return false end ; @program = val ; save ;   return true end
  def set_note      val ; if is_locked then return false end ; @note = val ; save ;      return true end

  # System

  def __connect q = nil

    return "You are #{print}."

  end

  def __look q = nil

    return "#{look_head}#{look_note}#{look_visibles}#{look_hint}"

  end

  # Basic

  def __create q = nil

    q = q
    q = " #{q} ".sub(" a ","").sub(" an ","").sub(" the ","").strip

    _name      = q.split(" ").last
    _attribute = q.split(" ").length > 1 ? q.split(" ").first : nil

    new_vessel = Basic.new($nataniev.find_available_id,{'CODE' => "0000-#{parent.to_s.prepend("0",5)}-#{id.to_s.prepend("0",5)}-00000-#{now}", 'NAME' => _name, 'ATTR' => _attribute})
    new_vessel.save

    return "You created #{new_vessel.print}."
    
  end

  def __become q = nil

    return "TODO"
    
  end

  def __enter q = nil

    v = find_visible_vessel(q) ; if !v then return error_target(q) end

    return set_parent(v.id) ? "You entered #{v.print}." : "The #{name} is locked."
    
  end

  def __leave q = nil

    if @parent == parent_vessel.parent then return error_stem end

    return set_parent(parent_vessel.parent) ? "You left #{parent_vessel.print}." : "The #{name} is locked."
    
  end

  # Narative

  def __note q = nil

    return parent_vessel.set_note(q) ? "You added a note to #{parent_vessel.print}." : "The #{parent_vessel.name} cannot be modified."
    
  end

  def __rename q = nil

    return "TODO"
    
  end

  # Warp

  def __warp q = nil

    q = q.sub("to ","").to_i
    v = $nataniev.make_vessel(q.to_i) ; if !v then return error_target(q) end

    return set_parent(v.id) ? "You warped to #{v.print}." : "The #{name} is locked."
    
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

    return v.set_parent(@id) ? "You took #{v.print}." : "The #{v.name} is locked."
    
  end

  def __drop q = nil

    v = find_inventory_vessel(q) ; if !v then return error_target(q) end

    return v.set_parent(@parent) ? "You dropped #{v.print}." : "The #{v.name} is locked."
    
  end

  # Programming

  def __program q = nil

    return "TODO"
    
  end

  def __poke q = nil ; return __use(q) end

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

    return v.set_lock(1) ? "You locked #{v.print}." : "You cannot lock the #{v.name}."
    
  end

  def __unlock q = nil

    v = find_present_vessel(q) ; if !v then return error_target(q) end

    return v.set_lock(0) ? "You unlocked #{v.print}." : "You cannot unlock the #{v.name}."
    
  end

  def __show q = nil

    v = find_present_vessel(q) ; if !v then return error_target(q) end
    
    return v.set_hide(0) ? "You revealed #{v.print}." : "You cannot reveal the #{v.name}."
    
  end

  def __hide q = nil

    v = find_present_vessel(q) ; if !v then return error_target(q) end

    return v.set_hide(1) ? "You hid #{v.print}." : "You cannot hide the #{v.name}."
    
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
      if parent == code[5,5].to_i 
        if tries == 0
          return "You are at the stem of the #{$nataniev.make_vessel(parent).name} universe."
        else
          return "You are #{tries} levels deep, in the #{$nataniev.make_vessel(parent).name} universe." 
        end
      end
      parent = code[5,5].to_i
      tries += 1
    end

    return "You are in a circular paradox."

  end

end