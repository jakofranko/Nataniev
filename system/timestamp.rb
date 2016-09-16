#!/bin/env ruby
# encoding: utf-8

require 'date'

class Timestamp

  def initialize stamp = nil

    @stamp = !stamp || stamp.to_i < 1 ? DateTime.parse(Time.now.to_s).strftime("%Y%m%d%H%M%S") : stamp
      
    @y = @stamp[0,4].to_i
    @m = @stamp[4,2].to_i
    @d = @stamp[6,2].to_i
    @H = @stamp[8,2].to_i
    @M = @stamp[10,2].to_i
    @S = @stamp[12,2].to_i

  end

  def elapsed

    return Time.new.to_i - (Date.new(@y,@m,@d).to_time.to_i + (60 * 60 * @H) + (60 * @M) + (@S) )

  end

  def ago

    if elapsed < 60 then return "now" end
    if elapsed/60.to_f < 60 then return "#{(elapsed/60.to_f).to_i} minutes ago" end
    if elapsed/60/60.to_f < 60 then return "#{(elapsed/60/60.to_f).to_i} hours ago" end

    timeDiff = (elapsed/86400)

    if timeDiff < -1 then return "In "+(timeDiff*-1).to_s+" days" end
    if timeDiff == -1 then return "tomorrow" end
    if timeDiff == 0 then return "today" end
    if timeDiff == 1 then return "yesterday" end
    if timeDiff <  7 then return "#{timeDiff} days ago" end
    if timeDiff == 7 then return "a week ago" end
    if timeDiff >  740 then return (timeDiff/30/12).to_s+" years ago" end
    if timeDiff >  60 then return (timeDiff/30).to_s+" months ago" end
    if timeDiff >  30 then return "a month ago" end

    return "#{elapsed} / #{timeDiff}"

  end

  def to_s

    return @stamp.to_s
    
  end

end