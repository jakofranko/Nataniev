#!/bin/env ruby
# encoding: utf-8

module ActionUnlock

  def unlock q = nil

    v = find_present_vessel(q) ; if !v then return error_target(q) end

    return v.set_lock(0) ? "! You unlocked #{v.print}." : "! You cannot unlock the #{v.name}."
    
  end

end