#!/bin/env ruby
# encoding: utf-8

class Object

  def docs q = nil

    p q

    p __callee__
    p Module
    p Module.nesting

  end

end