#!/bin/env ruby
# encoding: utf-8

class CorpseJson

  include Corpse

  def to_html

    return @payload.to_json

  end

end
