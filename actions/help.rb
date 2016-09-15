#!/bin/env ruby
# encoding: utf-8

module ActionHelp

  def help q = nil

    text = "& Something here\n"

    text += "# Vessel Actions:\n"
    @actor.actions.available.each do |action|
      text += "- _ #{action}\n"
    end

    text += "# Parent Actions:\n"
    @actor.parent_vessel.parent_actions.available.each do |action|
      text += "- _ #{action}\n"
    end

    return text

  end

end