#!/bin/env ruby
# encoding: utf-8

class ActionLook

  include Action

  def initialize q = nil

    super

    @name = "Look"
    @docs = "Does nothing at the moment."

  end

  def act q = nil

    return "Missing?"

  end

end