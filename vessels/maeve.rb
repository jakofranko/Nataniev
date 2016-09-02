#!/bin/env ruby
# encoding: utf-8

class Maeve

	include Vessel

	def print ; return "Maeve" end

	def __look q = nil

		return "#{print.capitalize} sees #{sight.first.length} to move, #{sight.last.length} to destroy."

	end

	def auto q = nil # TODO

		return "Nothing to do."

	end

	def sight

		sight_destroy = []
		sight_move = []

		id = 50
		while id < $nataniev.parade.to_a.length
			id += 1
			vessel = $nataniev.make_vessel(id)
			if vessel.class.name != "Basic" then next end
			if vessel.rating < 3 then sight_destroy.push(vessel) end
			if !vessel.parent_vessel then sight_move.push(vessel) end
		end

		return sight_move, sight_destroy

	end

end