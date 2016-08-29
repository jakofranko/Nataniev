#!/bin/env ruby
# encoding: utf-8

class Estat

	include Vessel

	def display

		# TODO: Display vessels that can be destroyed
		return "? #{print.capitalize}, displays #{$nataniev.parade.to_a.length}.\n"

	end

end