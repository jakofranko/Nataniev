#!/bin/env ruby
# encoding: utf-8

module ActionBecome

  def become q = nil

    if @target.is_locked then return error_locked(q) end

    return "::#{@target.id}"
    
  end

end