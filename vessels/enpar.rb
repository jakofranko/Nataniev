#!/bin/env ruby
# encoding: utf-8

class Enpar

	include Vessel

	def display
		
		# TODO: Rename..
		return "> #{print.capitalize}, contains #{En.new(attribute).to_h.length} entries."

	end

	def use q = nil

		text = ""
		En.new(attribute).to_h.each do |k,v|
			text += "#{k}\n"
		end

		return text

	end

end