#!/bin/env ruby
# encoding: utf-8

class VesselGhost # TODO

  include Vessel

  def initialize id = 0

    super

    @name = "A ghost"
    @docs = "The Ghost vessel cannot act."
    @path = File.expand_path(File.join(File.dirname(__FILE__), "/"))

    install(:generic,:look)
    install(:generic,:help)

  end

end