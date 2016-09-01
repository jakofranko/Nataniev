#!/bin/env ruby
# encoding: utf-8

class Estat

	include Vessel

	def display

		count = 0
		$nataniev.parade.to_a.each do |v|
			if !v['CODE'] then next end
			count += 1
		end

		perc = count/20000.to_f
		perc *= 1000
		perc = perc.to_i.to_f
		perc /= 10

		return "? #{print.capitalize}, displays #{(perc)}%\n"

	end

end