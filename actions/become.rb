#!/bin/env ruby
# encoding: utf-8

module ActionBecome

  def become q = nil

    v = find_visible_vessel(q) ; if !v then return error_target(q) end

    if v.is_locked then return error_locked(q) end

    return "::#{v.id}"
    
  end

end