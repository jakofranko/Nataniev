#!/bin/env ruby
# encoding: utf-8

class ActionServe

  include Action

  def initialize q = nil

    super

    @name = "Serve"
    @docs = "Serve corpse."
    @corpse = CorpseBase.new

  end

  def act params = nil

    @host.corpse.metas = ""
    @host.corpse.scripts = ""
    @host.corpse.links = ""
    @host.corpse.footers = ""

    @host.corpse.build
    @host.corpse.query(params)

    return @host.corpse.to_html

  end

end