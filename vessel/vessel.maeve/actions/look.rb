#!/bin/env ruby
# encoding: utf-8

class ActionLook

  include Action

  def initialize q = nil

    super

    @name = "Look"
    @docs = "Deliver html documentation."

  end
  
  def act q = ""

    return "HEY"

  end

end