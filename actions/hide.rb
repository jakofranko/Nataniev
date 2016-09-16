#!/bin/env ruby
# encoding: utf-8

module ActionHide

  def hide q = nil
    
    return @target.set_hide(1) ? "! You hid #{@target.print}." : "You cannot hide the #{@target.name}."
    
  end

end