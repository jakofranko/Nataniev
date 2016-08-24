#!/bin/env ruby
# encoding: utf-8

class Wildcard

	def initialize txt

		@txt = txt

	end

	def render

		output = @txt
		swaps = _swaps
		output.split(" ").each do |word|
			if swaps[word] then output = output.gsub(word,swaps[word]) end
		end
		return output

	end

	def _swaps

		hash = {}
		hash["VESSEL:FULL"] = $player.print
		hash["VESSEL:NAME"] = $player.name
		hash["VESSEL:ATTR"] = $player.attribute
		hash["PARENT:FULL"] = $parent.print
		hash["PARENT:NAME"] = $parent.name
		hash["PARENT:ATTR"] = $parent.attribute
		hash["TIME::"] = DateTime.parse(Time.now.to_s).strftime("%H:%M").to_s
		hash["TIME:H"] = DateTime.parse(Time.now.to_s).strftime("%H").to_s
		hash["TIME:M"] = DateTime.parse(Time.now.to_s).strftime("%M").to_s
		hash["TIME:S"] = DateTime.parse(Time.now.to_s).strftime("%S").to_s
		hash["DATE:Y"] = DateTime.parse(Time.now.to_s).strftime("%Y").to_s
		hash["DATE:M"] = DateTime.parse(Time.now.to_s).strftime("%m").to_s
		hash["DATE:D"] = DateTime.parse(Time.now.to_s).strftime("%d").to_s
		return hash

	end

end