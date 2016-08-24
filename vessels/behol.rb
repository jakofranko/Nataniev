#!/bin/env ruby
# encoding: utf-8

class Behol

	include Vessel

	def print ; return "the Beholder" end

	def __look q = nil ; return "#{print.capitalize} is blind." end

	def __connect q = nil

		return "#{print.capitalize} is online."

	end

	def __view q = nil

		return "Seeing: #{q}"

	end
	
end