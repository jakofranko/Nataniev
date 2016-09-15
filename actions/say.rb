#!/bin/env ruby
# encoding: utf-8

module ActionSay

  def say q = nil

    _room = "#{@actor.id}".prepend("0",5)
    _id   = "#{$nataniev.actor.id}".prepend("0",5)
    _name = "#{$nataniev.actor.name}".append(" ",14)

    flatten = "#{_room}-#{_id}-#{now} #{_name} #{q}\n"

    Di.new("forum").add(flatten)
    return "+ Added message: #{q}"

  end

end