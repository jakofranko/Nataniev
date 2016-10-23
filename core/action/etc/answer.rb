#!/bin/env ruby
# encoding: utf-8

module ActionAnswer

  include Action

  def answer q = nil

    return "Huh? #{q}?"
    
  end

end