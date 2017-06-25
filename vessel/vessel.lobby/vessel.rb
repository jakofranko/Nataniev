#!/bin/env ruby
# encoding: utf-8

class VesselLobby

  include Vessel

  def initialize id = 0

    super

    @name = "Lobby"
    @path = File.expand_path(File.join(File.dirname(__FILE__), "/"))
    @docs = "The Nataniev lobby."

    install(:custom,:serve)
    install(:generic,:document)
    install(:generic,:help)

  end

end