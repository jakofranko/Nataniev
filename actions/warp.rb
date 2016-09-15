#!/bin/env ruby
# encoding: utf-8

module ActionWarp

  def warp q = nil

    parts = q.split(" ")
    command = "warp_#{parts[0]}_#{parts[1]}".strip
    target = q.sub("#{parts[0]} #{parts[1]}","").strip

    if self.respond_to?(command,target)
      return self.send(command,target).strip
    else
      return "? Unknown command"
    end
    
  end

  private

  # Warp To
  
  def warp_to v

    if v.is_hidden then return error_hidden(v.name) end

    return @actor.set_parent(v.id) ? "! You warped in #{v.print}." : "! The #{v.name} is locked."    

  end

  def warp_to_id q = nil

    v = $nataniev.make_vessel(id) ; if !v then return error_target(q) end

    return warp_to(v.parent_vessel)

  end

  def warp_to_my q = nil

    v = find_owned_vessel(q) ; if !v then return error_target(q) end

    return warp_to(v.parent_vessel)

  end

  def warp_to_the q = nil

    v = find_the_vessel(q) ; if !v then return error_target(q) end

    return warp_in(v.parent_vessel) 

  end

  def warp_to_a q = nil

    v = find_any_vessel(q) ; if !v then return error_target(q) end

    return warp_in(v.parent_vessel)

  end

  # Warp In

  def warp_in v

    if v.is_hidden then return error_hidden(v.name) end

    return @actor.set_parent(v.id) ? "! You warped in #{v.print}." : "! The #{name} is locked."    

  end

  def warp_in_id q = nil

    v = $nataniev.make_vessel(id) ; if !v then return error_target(q) end

    return warp_to(v)

  end

  def warp_in_my q = nil

    v = find_owned_vessel(q) ; if !v then return error_target(q) end

    return warp_in(v)

  end

  def warp_in_the q = nil
    
    v = find_the_vessel(q) ; if !v then return error_target(q) end

    return warp_in(v)

  end

  def warp_in_a q = nil

    v = find_any_vessel(q) ; if !v then return error_target(q) end

    return warp_in(v)

  end

  # Etc..

  def warp_randomly q = nil

    v = $nataniev.find_random_vessel ; if !v then return error_random end

    return warp(v.id)
    
  end

end