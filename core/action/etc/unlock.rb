#!/bin/env ruby
# encoding: utf-8

module ActionUnlock

  include Action
  
  def unlock q = nil

    return @target.set_lock(0) ? "! You unlocked #{@target.print}." : "! You cannot unlock the #{@target.name}."
    
  end

end