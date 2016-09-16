#!/bin/env ruby
# encoding: utf-8

module ActionUse # TODO

   def use q = nil

    name = " #{q} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").first.to_s.strip

    v = find_visible_vessel(name) ; if !v then return error_target(name) end

    params = q.split(v.name) ; params[0] = nil

    return v.use(params.join.strip)
    
  end

end