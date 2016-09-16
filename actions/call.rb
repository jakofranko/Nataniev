#!/bin/env ruby
# encoding: utf-8

module ActionCall

  def call q = nil

    parts = q.split(" ")

    if parts.last.to_i > 0
      return call_id(parts.last.to_i)
    elsif self.respond_to?("call_#{parts.first}")
      return self.send("call_#{parts.first}",parts.last).strip
    else
      return "? Unknown command"
    end

    return $nataniev.make_vessel(q.to_i).answer

  end

  def call_id id

    return $nataniev.make_vessel(id).answer

  end

  def call_my q = nil

    v = find_owned_vessel(q) ; if !v then return error_target(q) end

    return v.answer

  end

  def call_the q = nil

    v = find_the_vessel(q) ; if !v then return error_target(q) end

    return v.answer

  end

  def call_a q = nil

    v = find_any_vessel(q) ; if !v then return error_target(q) end

    return v.answer

  end

end