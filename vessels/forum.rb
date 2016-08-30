#!/bin/env ruby
# encoding: utf-8

class Forum

	include Vessel

	def note

		@forum = Di.new("forum")
		
		sorted = {}
		count = 0
		@forum.to_a.reverse.each do |line|
			if count > 15 then break end
			time = line['CODE'].split("-").last
			if !sorted[Timestamp.new(time).ago] then sorted[Timestamp.new(time).ago] = [] end
			sorted[Timestamp.new(time).ago].push(line)
			count += 1
		end

		text = "This vessel grants you the unique command \"say\".\n\n"
		sorted.to_a.reverse.each do |ago,messages|
			text += "# #{ago.capitalize}\n"
			messages.reverse.each do |message|
				text += "- #{message['TEXT']}, said #{message['NAME']}\n"
			end
		end

		return text

	end

	def use q = nil

		return "QUERY: #{q}"
		
	end

	def via__say q = nil

		_code = "0000"
		_room = "#{parent}".prepend("0",5)
		_id   = "#{id}".prepend("0",5)
		_name = "#{$nataniev.player.name}".append(" ",14)

		flatten = "#{_code}-#{_room}-#{_id}-#{now} #{_name} #{q}\n"

		Di.new("forum").add(flatten)
		return "Added message: #{q}"

	end

end