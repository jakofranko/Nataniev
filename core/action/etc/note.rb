#!/bin/env ruby
# encoding: utf-8

module ActionNote

  include Action
  
  def note q = nil

    return @target.set_note(q) ? "! You added a note to #{@target.print}." : "! The #{@target.name} cannot be modified."
    
  end

end