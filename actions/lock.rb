#!/bin/env ruby
# encoding: utf-8

module ActionLock

  def lock q = nil

    return @target.set_lock(1) ? "! You locked #{@target.print}." : "! You cannot lock the #{@target.name}."
    
  end

end