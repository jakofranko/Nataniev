#!/bin/env ruby
# encoding: utf-8

class ActionHelp

  include Action

  def initialize q = nil

    super

    @name = "Help"
    @docs = "[TODO]"

  end

  def act q = nil

    t = ""

    host.actions.each do |category,actions|
      t += "> #{category.capitalize}\n"
      actions.each do |action|
        action = action.new
        t += "#{action.name} | #{action.docs}\n"
      end
    end

    return t

  end

end