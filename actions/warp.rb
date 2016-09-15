#!/bin/env ruby
# encoding: utf-8

module ActionWarp

  def warp q = nil

    q = q.to_s.sub("to ","").to_i
    v = $nataniev.make_vessel(q.to_i) ; if !v then return error_target(q) end

    return set_parent(v.id) ? "! You warped to #{v.print}." : "! The #{name} is locked."
    
  end

  private

  # TODO
  
  def warp_to_my q = nil ; return "" end
  def warp_to_the q = nil ; return "" end
  def warp_to_a q = nil ; return "" end
  def warp_in_my q = nil ; return "" end
  def warp_in_the q = nil ; return "" end
  def warp_in_a q = nil ; return "" end
  
  def warp_random q = nil

    v = $nataniev.find_random_vessel ; if !v then return error_random end

    return warp(v.id)
    
  end

  def find q = nil # TODO

    if q.split(" ").first == "my"
      vessel = find_owned_vessel(q.sub("my ",''))
    else q.split(" ").first == "the"
      vessel = find_any_vessel(q.sub("my ",''))
    end

    if !vessel then return "! There are no vessel named \"#{q}\"." end
    if vessel.is_hidden then return "! The #{vessel.print} is hidden and cannot be located." end

    return "! {{#{vessel.print.capitalize}}} is located at #{vessel.parent}."

  end

end