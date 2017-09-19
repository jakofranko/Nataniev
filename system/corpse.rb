#!/bin/env ruby
# encoding: utf-8

module Corpse

  attr_accessor :host
  attr_accessor :query
  attr_accessor :payload

  def initialize host = nil

    @host = host
    @payload = "<empty/>"
    
  end

  # Override

  def query q = nil

  end

  def build q = nil
    
  end

end