#!/bin/env ruby
# encoding: utf-8

module ActionName # TODO: Rename

  def name q = nil

    name = q.split(" ").last

    if name.length > 14 then return "! Names cannot exceed 14 characters in length." end

    return parent_vessel.set_name(name) ? "! You named the #{parent_vessel.name}, a #{name}." : "! You cannot rename the #{parent_vessel.name}."
    
  end

  def make q = nil

    attribute = q.split(" ").last

    if attribute.length > 14 then return "! Attributes cannot exceed 14 characters in length." end

    return parent_vessel.set_attribute(attribute) ? "! You made the #{parent_vessel.name}, #{attribute}." : "! You cannot define the #{parent_vessel.name}."
    
  end

end