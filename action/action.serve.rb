#!/bin/env ruby
# encoding: utf-8

class ActionServe

  include Action

  def initialize q = nil

    super

    @name = "Serve"
    @docs = "Serve corpse."
    @corpse = CorpseHttp

  end

  def act params

    @host.corpse.build
    @host.corpse.query(params)
    
    return @host.corpse.to_html

  end

end