#!/bin/env ruby
# encoding: utf-8

class Maeve

	include Vessel

	def __connect q = nil ; return "#{print.capitalize} is now active." end

	def __look q = nil

		sight = {}
		id = 0
		while id < $nataniev.parade.to_a.length
			vessel = $nataniev.make_vessel(id)
			if !sight[vessel.rating] then sight[vessel.rating] = [] end
			sight[vessel.rating].push(vessel)
			id += 1
			if vessel.rating < 2 then puts "#{vessel.id.to_s.prepend("0",5)} #{vessel.print.append(" ",30)} - #{vessel.rating}" ; vessel.destroy end
		end

		return "WHHAAAd."

	end

	def auto q = nil # TODO

		puts "?"
		
	end

end