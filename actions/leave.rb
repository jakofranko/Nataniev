#!/bin/env ruby
# encoding: utf-8

module ActionLeave

  def leave q = nil

    if @parent == parent_vessel.parent then return error_stem end

    return set_parent(parent_vessel.parent) ? "! You left #{parent_vessel.print}." : "! The #{name} is locked."

  end

end