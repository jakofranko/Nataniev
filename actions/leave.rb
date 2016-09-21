#!/bin/env ruby
# encoding: utf-8

module ActionLeave

  include Action
  
  def leave q = nil

    if @actor.parent == @actor.parent_vessel.parent then return error_stem end

    return @actor.set_parent(@actor.parent_vessel.parent) ? "! You left #{@actor.parent_vessel.print}." : "! The #{@actor.name} is locked."

  end

end