#!/bin/env ruby
# encoding: utf-8

module ActionDrop

  include Action
  
  def drop q = nil

    return @target.set_parent(@actor.parent) ? "! You dropped #{@target.print}." : "! The #{@target.name} is locked."
    
  end

end