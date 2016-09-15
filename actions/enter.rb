#!/bin/env ruby
# encoding: utf-8

module ActionEnter

  include Action

  def enter q = nil

    v = find_visible_vessel(q) ; if !v then return error_target(q) end

    return @actor.set_parent(v.id) ? "! You entered #{v.print}." : "! The #{name} is locked."

  end

end