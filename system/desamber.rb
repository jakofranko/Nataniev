#!/bin/env ruby
# encoding: utf-8

require 'date'

class Desamber

	def initialize(date = Date.today.to_s)

		@date = date
		@dict = ['Unesamber', 'Dutesamber', 'Trisesamber', 'Tetresamber', 'Pentesamber', 'Hexesamber', 'Sevesamber', 'Octesamber', 'Novesamber', 'Desamber', 'Undesamber', 'Dodesamber', 'Tridesamber']

	end

	def month

		return @date[5,2].to_i

	end

	def day

		return @date[8,2].to_i

	end

	def year

		return @date[0,4].to_i

	end

	def monthName

		return "#{@dict[equalMonth-1]}"

	end

	def span

		return Date.new(y=year,m=month,d=day).yday

	end

	def equalMonth
		
		if span >= 365 then return 0 end
		return (span/28.to_f).ceil

	end

	def equalDay

		if span == 365 then return "Year Day" end
		if span == 366 then return "Leap Day" end
		return (span % 28) == 0 ? 28 : span % 28

	end

	def default_month_year

		return "#{@dict[equalMonth-1]} #{year}"

	end

	def default
	
		return "#{@dict[equalMonth-1]} #{equalDay}, #{year}"

	end

end