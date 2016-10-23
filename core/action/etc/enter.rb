#!/bin/env ruby
# encoding: utf-8

module ActionEnter

  include Action
  
  def enter q = nil

    return @actor.set_parent(@target.id) ? "! You entered #{@target.print}." : "! The #{@target} is locked."

  end

end