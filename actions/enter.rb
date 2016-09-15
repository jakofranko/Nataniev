#!/bin/env ruby
# encoding: utf-8

module ActionEnter

  def enter q = nil

    v = find_visible_vessel(q) ; if !v then return error_target(q) end

    return set_parent(v.id) ? "! You entered #{v.print}." : "! The #{name} is locked."

  end

end