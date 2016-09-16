#!/bin/env ruby
# encoding: utf-8

module ActionTake

  def take q = nil

    v = find_visible_vessel(q) ; if !v then return error_target(q) end

    return v.set_parent(@id) ? "! You took #{v.print}." : "! The #{v.name} is locked."
    
  end

end