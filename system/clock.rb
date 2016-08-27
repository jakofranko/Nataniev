#!/bin/env ruby
# encoding: utf-8

class Clock

	def initialize query = nil

		@time = Time.now + (3600 * 13) # server offset(+13 hours:Japan)
		
	end

	def elapsed

		return ((@time.hour) * 60 * 60) + (@time.min * 60) + @time.sec

	end

	def timeInt

		return ((elapsed / 86400.0) * 1000000).to_i

	end

	def timeStr

		return timeInt.to_s.append("0",6)

	end

	def format_normal

		return timeStr[0,3]+":"+timeStr[3,3]

	end

	def default

		return format_normal
		
	end

end