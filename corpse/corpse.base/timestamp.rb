#!/bin/env ruby
# encoding: utf-8

require 'date'

class Timestamp

  attr_accessor :y
  attr_accessor :m
  attr_accessor :d
  attr_accessor :H
  attr_accessor :M
  attr_accessor :S

  def initialize stamp = nil

    @stamp = !stamp || stamp.to_i < 1 ? DateTime.parse(Time.now.to_s).strftime("%Y%m%d%H%M%S") : stamp    
    @stamp = @stamp.gsub("-","")
    @dict = ["January", "February", "March", "April", "May", "June", "July", "August", "September",  "October",  "November",  "December"]
    
    @y = @stamp[0,4].to_i
    @m = @stamp[4,2].to_i
    @d = @stamp[6,2].to_i
    @H = @stamp[8,2].to_i
    @M = @stamp[10,2].to_i
    @S = @stamp[12,2].to_i

  end

  def month_name

    return @dict[@m-1]

  end

  def unix

    return Date.new(@y,@m,@d).to_time.to_i

  end

  def elapsed

    return Time.new.to_i - (unix + (60 * 60 * @H) + (60 * @M) + (@S) )

  end

  def ago

    if elapsed < 60 then return "Today" end
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

    return "#{timeDiff/7} weeks ago"

  end

  def since

    return (elapsed/86400)
    
  end

  def to_s

    return @stamp.to_s
    
  end

end