#!/bin/env ruby
# encoding: utf-8

module Corpse

  attr_accessor :host
  attr_accessor :query

  def initialize host, query = nil

    @host = host
    @query = query
    
  end

  def result

    return "Shapeless."

  end

end