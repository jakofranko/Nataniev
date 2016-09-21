#!/bin/env ruby
# encoding: utf-8

module ActionCall

  def call q = nil

    target = q.split(" ").first
    params = q.sub(target,"").to_s.strip

    if target.to_i > 0
      return call_id(target,params)
    elsif $nataniev.make_anonym(target).class != Ghost.class
      return call_anonym(target,params)      
    end

    return "? Unknown call"

  end

  def call_anonym instance, params

    return $nataniev.make_anonym(instance).passive_actions.answer(params)

  end

  def call_id id, params

    return $nataniev.make_vessel(id).passive_actions.answer(params)

  end

end