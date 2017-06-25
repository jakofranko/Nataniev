#!/bin/env ruby
# encoding: utf-8

module Action

  attr_accessor :host
  attr_accessor :name
  attr_accessor :docs

  def initialize host = nil

    @host = host
    @name = "Unknown"
    @docs = "No documentation"

  end

end