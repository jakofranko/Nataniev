#!/bin/env ruby
# encoding: utf-8

class Estat

	include Vessel

	def display

		return "? #{print.capitalize}, displays #{$nataniev.parade.to_a.length}.\n"

	end

end