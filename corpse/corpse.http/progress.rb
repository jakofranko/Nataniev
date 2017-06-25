#!/bin/env ruby
# encoding: utf-8

class Progress

  def initialize val,max

    @val = val
    @max = max.to_f

  end

  def to_s

    if @val.kind_of?(Hash)
      html = ""
      @val.each do |name,value|
        html += "<ln class='#{name}' style='width:#{(value.to_f/@max)*100}%'></ln>"
      end
      return "<yu class='progress'>#{html}</yu>"
    end

    return "<yu class='progress'><ln style='width:#{(@val/@max)*100}%'></ln></yu>"

  end

end
