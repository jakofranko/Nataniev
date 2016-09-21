#!/bin/env ruby
# encoding: utf-8

module Documentation

  def docs q = nil

    p q

    p __callee__
    p Module
    p Module.nesting

  end

end