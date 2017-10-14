#!/bin/env ruby
# encoding: utf-8

require 'date'

class Desamber

  attr_accessor :dict
  
  def initialize(date = Date.today.to_s)

    @date = date.gsub("-","")
    @dict = ['Unesamber', 'Dutesamber', 'Trisesamber', 'Tetresamber', 'Pentesamber', 'Hexesamber', 'Sevesamber', 'Octesamber', 'Novesamber', 'Desamber', 'Undesamber', 'Dodesamber', 'Tridesamber', 'Year Day']
    @time = Time.now + (3600 * 13) # server offset(+13 hours:Japan)

  end

  def y

    return @date[0,4].to_i
    
  end

  def m

    if span >= 365 then return 0 end
    return (span/28.to_f).ceil

  end

  def d

    if span == 365 then return "Year Day" end
    if span == 366 then return "Leap Day" end
    return (span % 28) == 0 ? 28 : span % 28

  end

  def stamp

    return "#{y}#{m.to_s.prepend('0',2)}#{d.to_s.prepend('0',2)}"

  end

  def month_name

    return "#{@dict[m-1]}".to_sym

  end

  def span

    return Date.new(y=@date[0,4].to_i,m=@date[4,2].to_i,d=@date[6,2].to_i).yday

  end

  def default_month_year

    return "#{@dict[m-1]} #{y}"

  end

  def to_s diminitive = false

    return "#{diminitive ? @dict[m-1][0,3] : @dict[m-1]} #{d}, #{y}"

  end

  # Clock

  def elapsed

    return ((@time.hour) * 60 * 60) + (@time.min * 60) + @time.sec

  end

  def to_i

    return ((elapsed / 86400.0) * 1000000).to_i

  end

  def timeStr

    return "#{to_i}".append("0",6)

  end

  def above

    return timeStr[0,3]
    
  end

  def below

    return timeStr[3,3]
    
  end

  def clock

    return "#{above}:#{below}"

  end

end