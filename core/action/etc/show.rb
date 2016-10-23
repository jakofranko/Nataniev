#!/bin/env ruby
# encoding: utf-8

module ActionShow

  include Action
  
  def show q = nil
    
    return @target.set_hide(0) ? "! You revealed #{@target.print}." : "You cannot reveal the #{@target.name}."
    
  end

end