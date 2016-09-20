#!/bin/env ruby
# encoding: utf-8

module ActionTransform

  def transform q = nil

    name = q.split(" ").last

    if name.length > 14 then return "! Names cannot exceed 14 characters in length." end

    return @actor.set_name(name) ? "! You transformed into a #{name}." : "! You cannot rename the #{@actor.name}."
    
  end

end