#!/bin/env ruby
# encoding: utf-8

module ActionHelp

  include Action
  
  def help q = nil

    text = "& #{self.class}\n"

    text += "# Vessel Actions:\n"
    @actor.actions.available.each do |action|
      text += "- _ #{action}\n"
    end

    text += "# Parent Actions:\n"
    @actor.parent_vessel.parent_actions.available.each do |action|
      text += "- _ #{action}\n"
    end

    text += "# Default Actions:\n"
    @actor.default_actions.available.each do |action|
      text += "- _ #{action}\n"
    end

    # Visible
    collection = []
    @actor.visible_vessels.each do |v|
      v.target_actions.available.each do |action|
        collection.push(action)
      end
    end

    text += "# Target Actions:\n"
    collection.uniq.each do |action|
      text += "- _ #{action}\n"
    end

    # Presence
    collection = []
    @actor.visible_vessels.each do |v|
      v.presence_actions.available.each do |action|
        collection.push(action)
      end
    end

    text += "# Presence Actions:\n"
    collection.uniq.each do |action|
      text += "- _ #{action}\n"
    end

    return text

  end

end