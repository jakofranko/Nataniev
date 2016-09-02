#!/bin/env ruby
# encoding: utf-8

class Ghost

	include Vessel

	def name

		return "ghost"
		
	end

	def __connect q = nil

		return "#{print.capitalize} is awake."

	end

	def __look q = 3

		@parent = q

		return "#{look_head}#{look_note}#{look_visibles}#{look_hint}"

	end

	def __enter q = nil

		return "HEY"

	end
	
end