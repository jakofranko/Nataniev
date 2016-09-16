#!/bin/env ruby
# encoding: utf-8

module ActionCast

  def cast q = nil

  	if @target.owner != @actor.id then return error_owner(v.name) end

  	if q.to_s.length != 5 then return "#{q.to_s.capitalize} is not a vessel type." end

    return @target.set_instance(q.to_s) ? "! You casted #{@target.print} into a #{q} vessel." : "! The #{@target.name} is locked."
    
  end

end