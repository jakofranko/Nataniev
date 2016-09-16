#!/bin/env ruby
# encoding: utf-8

module ActionLock

  def lock q = nil

    v = find_present_vessel(q) ; if !v then return error_target(q) end

    return v.set_lock(1) ? "! You locked #{v.print}." : "! You cannot lock the #{v.name}."
    
  end

end