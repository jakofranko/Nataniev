#!/bin/env ruby
# encoding: utf-8

class VesselAtari

  include Vessel

  def initialize id = 0

    super

    @name = "Atari"

    install(:default,:document)
    install(:default,:help)

  end

end