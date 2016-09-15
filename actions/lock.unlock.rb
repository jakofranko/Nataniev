#!/bin/env ruby
# encoding: utf-8

module ActionLockUnlock

  def vis__lock q = nil

    v = find_present_vessel(q) ; if !v then return error_target(q) end

    return v.set_lock(1) ? "! You locked #{v.print}." : "! You cannot lock the #{v.name}."
    
  end

  def vis__unlock q = nil

    v = find_present_vessel(q) ; if !v then return error_target(q) end

    return v.set_lock(0) ? "! You unlocked #{v.print}." : "! You cannot unlock the #{v.name}."
    
  end

end