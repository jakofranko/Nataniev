#!/bin/env ruby
# encoding: utf-8

module ActionNote

  def note q = nil

    return parent_vessel.set_note(q) ? "! You added a note to #{parent_vessel.print}." : "! The #{parent_vessel.name} cannot be modified."
    
  end

end