#!/bin/env ruby
# encoding: utf-8

module ActionShow

  def show q = nil

    v = find_present_vessel(q) ; if !v then return error_target(q) end
    
    return v.set_hide(0) ? "! You revealed #{v.print}." : "You cannot reveal the #{v.name}."
    
  end

end