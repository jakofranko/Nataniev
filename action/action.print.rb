#!/bin/env ruby
# encoding: utf-8

class ActionPrint

  include Action

  def initialize q = nil

    super

    @name = "Print"
    @docs = "Outputs host's corpse payload."

  end

  def act params

    @host.corpse.query(params) # Override
    return @host.corpse.payload

  end

end
