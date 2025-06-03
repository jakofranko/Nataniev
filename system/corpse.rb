#!/bin/env ruby

# The flesh of a ghost
module Corpse

  attr_accessor :host, :payload

  def initialize(host = nil)

    @host = host
    @payload = '<empty/>'

  end

  # Override

  def query(q = nil) end

  def build(q = nil) end

end
