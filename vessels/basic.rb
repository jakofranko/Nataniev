#!/bin/env ruby
# encoding: utf-8

class Basic

	include Vessel

	# System

	def __connect q = nil

		return "#{print.capitalize} is online."

	end

	def __look q = nil

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
        text += vessel.display
      end
      text += "\n\n"
    end

    # Hint
    text += parent_vessel.hint ? "? #{parent_vessel.hint}" : ""

		return text

	end

	# Basic

	def __create q = nil

		return "TODO"
		
	end

	def __become q = nil

		return "TODO"
		
	end

	def __enter q = nil

    v = find_visible_vessel(q) ; if !v then return error_target(q) end

    set_parent(v.id) ; save

		return "You entered #{v.print}."
		
	end

	def __leave q = nil

    set_parent(parent_vessel.parent) ; save

		return "You left #{parent_vessel.print}."
		
	end

	# Narative

	def __note q = nil

		return "TODO"
		
	end

	def __rename q = nil

		return "TODO"
		
	end

	# Warp

	def __warp q = nil

    q = q.to_s.sub("to ","").to_i
    v = $nataniev.make_vessel(q.to_i) ; if !v then return error_target(q) end

    set_parent(v.id) ; save

		return "You warped to #{v.print}."
		
	end

	def __random q = nil

		return "TODO"
		
	end

	# Inventory

	def __inventory q = nil

		return "TODO"
		
	end

	def __take q = nil

    v = find_visible_vessel(q) ; if !v then return error_target(q) end

    v.__warp(@id) ; v.save

		return "You took #{v.print}."
		
	end

	def __drop q = nil

    v = find_inventory_vessel(q) ; if !v then return error_target(q) end

    v.__warp(@parent) ; v.save

    return "You dropped #{v.print}."
		
	end

	# Programming

	def __program q = nil

		return "TODO"
		
	end

	def __use q = nil

		return "TODO"
		
	end

	def __call q = nil

		return "TODO"
		
	end

	# Security

	def __lock q = nil

		return "TODO"
		
	end

	def __unlock q = nil

		return "TODO"
		
	end

	def __show q = nil

		return "TODO"
		
	end

	def __hide q = nil

		return "TODO"
		
	end
	
end