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

		return "? #{print.capitalize}, displays #{count}.\n"

	end

end