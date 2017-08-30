#!/bin/env ruby
# encoding: utf-8

class ActionServe

  include Action

  def initialize q = nil

    super

    @name = "Serve"
    @docs = "Serve corpse."

  end

  def act params

    p "#{@host.name} is serving[#{params}].."
    @host.corpse.query(params) # Override
    return @host.corpse.to_html

  end

end