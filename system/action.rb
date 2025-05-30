#!/bin/env ruby

# Agency, defined
module Action

  attr_accessor :host, :name, :docs, :corpse

  def initialize(host = nil)

    @host = host
    @name = 'Unknown'
    @docs = 'No documentation'
    @corpse = nil

  end

end
