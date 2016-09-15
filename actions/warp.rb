#!/bin/env ruby
# encoding: utf-8

module ActionWarp

  def warp q = nil

    q = q.to_s.sub("to ","").to_i
    v = $nataniev.make_vessel(q.to_i) ; if !v then return error_target(q) end

    return set_parent(v.id) ? "! You warped to #{v.print}." : "! The #{name} is locked."
    
  end

  private
  
  def warp_random q = nil

    v = $nataniev.find_random_vessel ; if !v then return error_random end

    return warp(v.id)
    
  end

end