#!/bin/env ruby
# encoding: utf-8

class Speak

	include Vessel

	def use q = nil

		say("vicki",q)
		
		return result

	end

	def say voice = 'katya', text

		system({"TEXT" => text,"VOICE" => voice}, "say -v $VOICE $TEXT &")

	end

	def translate english, russian

		# translate("Do you speak English?","Вы говорите по-английски?")

		system({"TEXT" => russian,"VOICE" => "katya"}, "say -v $VOICE $TEXT")
		system({"TEXT" => english,"VOICE" => "vicki"}, "say -v $VOICE $TEXT")

	end

end