#!/bin/env ruby
# encoding: utf-8

module ActionDrop

  def drop q = nil

    v = find_inventory_vessel(q) ; if !v then return error_target(q) end

    return v.set_parent(@parent) ? "! You dropped #{v.print}." : "! The #{v.name} is locked."
    
  end

end