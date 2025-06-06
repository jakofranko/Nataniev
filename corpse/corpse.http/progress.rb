#!/bin/env ruby

# A progress bar
class Progress

  def initialize(val, max)

    @val = val
    @max = max.to_f

  end

  def to_s

    if @val.is_a?(Hash)
      html = ''
      @val.each do |name, value|

        html += "<ln class='#{name}' style='width:#{(value.to_f / @max) * 100}%'></ln>"

      end
      return "<yu class='progress'>#{html}</yu>"
    end

    "<yu class='progress'><ln style='width:#{(@val / @max) * 100}%'></ln></yu>"

  end

end
