#!/bin/env ruby
# encoding: utf-8

class Basic

	include Vessel

	# System

	def __connect p = nil

		return "Connected"

	end

	def __look p = nil

		text = ""

		# Head
		if parent == id
      text += "~ "+"#{print}.\n\n".capitalize
    else
      text += "~ "+"#{print} in #{parent_vessel.print}.\n\n".capitalize
    end

    # Note
    if parent_vessel.note
	    note = parent_vessel.note.strip
	    note = note != "" ? "#{Wildcard.new(note).render}\n" : ""
	    note = note.gsub("&","\n&")
	    note = note.gsub("#","\n#")
	    text += note.strip+"\n\n"
	  end

    # Visibles
    if visible_vessels.length > 0
      visible_vessels.each do |vessel|
        text += "- "+vessel.print+"\n"
      end
      text += "\n\n"
    end


		return text

	end

	# Basic

	def __create p = nil

		return "TODO"
		
	end

	def __become p = nil

		return "TODO"
		
	end

	def __enter p = nil

		return "TODO"
		
	end

	def __leave p = nil

		return "TODO"
		
	end

	# Narative

	def __note p = nil

		return "TODO"
		
	end

	def __rename p = nil

		return "TODO"
		
	end

	# Warp

	def warp p = nil

		return "TODO"
		
	end

	def __random p = nil

		return "TODO"
		
	end

	# Inventory

	def __inventory p = nil

		return "TODO"
		
	end

	def __take p = nil

		return "TODO"
		
	end

	def __drop p = nil

		return "TODO"
		
	end

	# Programming

	def __program p = nil

		return "TODO"
		
	end

	def __use p = nil

		return "TODO"
		
	end

	def __call p = nil

		return "TODO"
		
	end

	# Security

	def __lock p = nil

		return "TODO"
		
	end

	def __unlock p = nil

		return "TODO"
		
	end

	def __show p = nil

		return "TODO"
		
	end

	def __hide p = nil

		return "TODO"
		
	end
	
end