#!/bin/env ruby
# encoding: utf-8

class VesselGhost # TODO

  include Vessel

  def initialize id = 0

    super

    @name = "A ghost"

    install(:generic,:look)
    install(:generic,:help)

  end

end