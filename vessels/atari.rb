#!/bin/env ruby
# encoding: utf-8

class Atari

	include Vessel

	def use q = nil

		return q ? $nataniev.answer(q) : "Query is empty."
		
	end

end