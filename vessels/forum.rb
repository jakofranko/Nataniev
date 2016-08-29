#!/bin/env ruby
# encoding: utf-8

class Forum

	include Vessel

	def note

		return "This vessel grants you new commands, say and listen."

	end

	def use q = nil

		# Discussion vessel
		# TODO: Display via__actions when in parent vessel.

		return "QUERY: #{q}"
		
	end

	def via__say q = nil

		return "hey" # TODO, create forum vessel

	end

end