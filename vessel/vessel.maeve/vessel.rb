#!/bin/env ruby
# encoding: utf-8

class VesselMaeve # TODO

  include Vessel

  def initialize id = 0

    super

    @name = "Unknown"
    @docs = "."
    @path = File.expand_path(File.join(File.dirname(__FILE__), "/"))

    install(:generic,:serve)
    install(:generic,:help)

  end

end