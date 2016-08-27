#!/bin/env ruby
# encoding: utf-8

class Wildcard

	def initialize txt

		@txt = txt

	end

	def render

		output = @txt

		# Operations RAND()
		search = @txt.scan(/(?:RAND\()([\w\W]*?)(?=\))/)
	    search.each do |str,details|
	    	output = output.gsub("RAND(#{str})",str.split(",").sample)
	    end

		# Swaps
		swaps = _swaps
		output.split(" ").each do |word|
			if swaps[word] then output = output.gsub(word,swaps[word]) end
		end
		return output

	end

	def _operations

	end

	def _swaps

		hash = {}
		hash["VESSEL:FULL"] = $nataniev.player.print
		hash["VESSEL:NAME"] = $nataniev.player.name
		hash["VESSEL:ATTR"] = $nataniev.player.attribute
		hash["PARENT:FULL"] = $nataniev.player.parent_vessel.print
		hash["PARENT:NAME"] = $nataniev.player.parent_vessel.name
		hash["PARENT:ATTR"] = $nataniev.player.parent_vessel.attribute
		hash["TIME::"] = Clock.new.default
		hash["TIME:H"] = DateTime.parse(Time.now.to_s).strftime("%H").to_s
		hash["TIME:M"] = DateTime.parse(Time.now.to_s).strftime("%M").to_s
		hash["TIME:S"] = DateTime.parse(Time.now.to_s).strftime("%S").to_s
		hash["DATE::"] = Desamber.new.default
		hash["DATE:Y"] = DateTime.parse(Time.now.to_s).strftime("%Y").to_s
		hash["DATE:M"] = DateTime.parse(Time.now.to_s).strftime("%m").to_s
		hash["DATE:D"] = DateTime.parse(Time.now.to_s).strftime("%d").to_s
		return hash

	end

end