#!/bin/env ruby
# encoding: utf-8

class Horai

	include Vessel

	def display

		# When days are missing, display the missing days instead. Same for lexicon.
		# Also add option to display available diaries.

		return "? #{print.capitalize}, contains #{Di.new('horaire').to_a.length} entries.\n"

	end

end