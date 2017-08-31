#!/bin/env ruby
# encoding: utf-8

module Corpse

  attr_accessor :host
  attr_accessor :query
  attr_accessor :payload

  def initialize host

    @host = host
    @payload = "<empty/>"
    
  end

  def build
    
  end

end