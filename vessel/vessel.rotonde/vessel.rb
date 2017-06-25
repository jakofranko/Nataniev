#!/bin/env ruby
# encoding: utf-8

class VesselRotonde

  include Vessel

  def initialize id = 0

    super

    @name = "Rotonde"
    @path = File.expand_path(File.join(File.dirname(__FILE__), "/"))
    @docs = "A communication application for Nataniev instances."

    install(:dialog,:serve)
    
    install(:generic,:help)
    install(:generic,:document)

  end

end