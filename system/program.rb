#!/bin/env ruby
# encoding: utf-8

class Program

	def initialize text

		@text = text

		@cond = ""
		@main = ""
		@main_echo = ""
		@else = ""
		@else_echo = ""
		
		parse

	end

	def parse

		if @text.to_s.strip == "" then return end

		event = @text

		if event[0,2].like("IF")
			event = event.sub("IF ","")
			@cond = event.split("THEN").first.strip
			event = event.sub(@cond+" THEN","").strip
			if event.include?("ELSE")
				@else = event.split("ELSE").last.strip
				event = event.sub("ELSE "+@else,"").strip
			end
		end

		@cond = @cond.strip
		@main = event.strip
		@else = @else.strip

		if event.include?("ECHO")
			@main_echo = event.split("ECHO").last.strip
			@main = event.sub("ECHO "+@main_echo,"").strip
		end
		if @else.include?("ECHO")
			@else_echo = @else.split("ECHO").last.strip
			@else = @else.sub("ECHO "+@else_echo,"").strip
		end

	end

	def isValid

		return @main != "" ? true : false
		
	end

	def isSolved

		parts = @cond.split(" ")
		if @cond == "" then return true end

		if parts.first == "HAS"
			$nataniev.player.inventory_vessels.each do |vessel|
				if vessel.name.like(parts.last) then return true end
			end
		elsif parts.first == "IS"
			if $nataniev.player.name.like(parts.last) then return true end
		end

		return false 

	end

	def run

		if isSolved
			return $nataniev.answer(Wildcard.new(@main).render)
		elsif @else
			return $nataniev.answer(Wildcard.new(@else).render)
		else
			return "Invalid program."
		end

	end

	def echo

		if isSolved
			return Wildcard.new(@main_echo).render
		else
			return Wildcard.new(@else_echo).render
		end

	end

	def to_s

		return @text.to_s.strip

	end

	def debug

		return ((@cond != "" ? "# COND #{@cond}\n" : "")+(@main != "" ? "# PROG #{@main}\n" : "")+(@main_echo != "" ? "# ECHO #{@main_echo}\n" : "")+(@else != "" ? "# ELSE #{@else}\n" : "")+(@else_echo != "" ? "# ECHO #{@else_echo}\n" : "")).to_s.strip

	end

end