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
	
end