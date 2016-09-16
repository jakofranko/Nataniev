#!/bin/env ruby
# encoding: utf-8

module ActionTake

  def take q = nil

    return @target.set_parent(@actor.id) ? "! You took #{@target.print}." : "! The #{@target.name} is locked."
    
  end

end