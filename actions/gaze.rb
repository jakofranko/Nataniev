#!/bin/env ruby
# encoding: utf-8

module ActionGaze

  def gaze q = nil

    instance = q.split(" ").first
    params   = q.sub(instance,"").to_s.strip
    target   = $nataniev.make_anonym(instance)
    return target.actions.sight(params)

  end

end