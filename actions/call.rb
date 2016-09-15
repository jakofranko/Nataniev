#!/bin/env ruby
# encoding: utf-8

module ActionCall

  def call q = nil

    if q.to_i < 1 then return error_id(q) end

    return $nataniev.make_vessel(q.to_i).use
    
  end

end