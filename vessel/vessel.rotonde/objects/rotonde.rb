#!/bin/env ruby
# encoding: utf-8

require 'json'

class Rotonde

  attr_accessor :name
  attr_accessor :location
  attr_accessor :position
  attr_accessor :avatar
  attr_accessor :color
  attr_accessor :glyph
  
  attr_accessor :feed
  attr_accessor :portal

  attr_accessor :name

  def initialize 

    @name = nil
    @location = nil
    @portal = []
    @feed = []

  end

  def to_json

    return {
      :profile => {
        :name => @name, 
        :location => @location,
        :position => @position,
        :avatar => @avatar,
        :color => @color,
        :glyph => @glyph
      },
      :feed => @feed,
      :portal => @portal
    }.to_json

  end

end