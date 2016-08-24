#!/bin/env ruby
# encoding: utf-8

class Parade

	#: Basic

	def act_create new_vessel_name # Create a new vessel.

		name = simplify(new_vessel_name).split(" ").length > 1 ? simplify(new_vessel_name).split(" ").last : simplify(new_vessel_name)
		attribute = simplify(new_vessel_name).split(" ").length > 1 ? simplify(new_vessel_name).split(" ").first : ""

		if name.length > 14 then return eror_length("name") end
		if attribute.length > 14 then return eror_length("attribute") end
		if isBanned(name) then return eror_banned(isBanned(name)) end
		if isBanned(attribute) then return eror_banned(isBanned(attribute)) end
		if vesselWithName(@visible,name) then return eror_clone(name) end
		if clone = vesselWithNameAndAttribute(@world.to_a,name,attribute) then return eror_clone("a #{attribute} #{name}",clone) end

		vesselId = availableId
		timestamp = DateTime.parse(Time.now.to_s).strftime("%Y%m%d%H%M%S")

		if vesselId > 20000 then return eror_estate(vesselId) end

		vesselcode = {}
		vesselcode['CODE'] = "0000-#{@player.parent.to_s.prepend("0",5)}-#{@player.id.to_s.prepend("0",5)}-00000-#{timestamp}"
		vesselcode['NAME'] = name
		vesselcode['ATTR'] = attribute

		vessel = Vessel.new(vesselId,vesselcode)

		@world.save(vessel.id,vessel.render)

		return "You created #{vessel.print} in #{@parent.print}."

	end

	def act_become visible_vessel_name # Embody a visible vessel.

		targetVessel = vesselWithName(@visible,simplify(visible_vessel_name))

		if !targetVessel then return eror_target(visible_vessel_name) end

		return "::#{targetVessel.id}"

	end

	def act_enter visible_vessel_name # Enter a visible vessel.

		targetVessel = vesselWithName(@visible,simplify(visible_vessel_name))

		if @player.isLocked then return eror_locked(@player.print) end
		if !targetVessel then return eror_target(visible_vessel_name) end
		if !targetVessel.isEnterAllowedFor(@player) then return eror_locked(targetVessel.print) end

		@player.setParent(targetVessel.id)
		@world.save(@player.id,@player.render)

		return "You entered {{#{targetVessel.print}}}."
		
	end

	def act_leave none = nil # Leave the current parent vessel.

		if @player.isLocked then return eror_locked(@player.print) end
		if @parent.parent == @parent.id then return eror_stem(@parent.print) end
		if !@parent.isEnterAllowedFor(@player) then return eror_locked(@parent.print) end

		old_parent = @parent

		@player.setParent(@parent.parent)
		@world.save(@player.id,@player.render)

		return "You left {{#{old_parent.print}}}."
		
	end

	#: Narative

	def act_note text # Add note to the parent vessel.

		if @parent.isLocked then return eror_locked(@parent.print) end

		@parent.setNote(text)
		@world.save(@parent.id,@parent.render)

		return "You added a note to {{#{@parent.print}}}."

	end

	def act_rename new_vessel_name # Create a new vessel.

		name = simplify(new_vessel_name).split(" ").length > 1 ? simplify(new_vessel_name).split(" ").last : simplify(new_vessel_name)
		attribute = simplify(new_vessel_name).split(" ").length > 1 ? simplify(new_vessel_name).split(" ").first : ""

		if name.length > 14 then return eror_length("name") end
		if attribute.length > 14 then return eror_length("attribute") end
		if isBanned(name) then return eror_banned(isBanned(name)) end
		if isBanned(attribute) then return eror_banned(isBanned(attribute)) end
		if vesselWithName(@visible,name) then return eror_clone(name) end
		if clone = vesselWithNameAndAttribute(@world.to_a,name,attribute) then return eror_clone("a #{attribute} #{name}",clone) end
		if @parent.isLocked then return eror_locked(@parent.print) end

		new_name = name
		old_name = @parent.print
		parts = new_name.split(" ")

		if parts.length > 2
			return "Vessel names cannot contain more than attribute and a noun."
		elsif parts.length == 2
			@parent.setAttribute(parts.first.strip)
			@parent.setName(parts.last.strip)
		else
			@parent.setName(new_name.strip)
		end
		@world.save(@parent.id,@parent.render)

		return "You renamed #{old_name} to {{#{@new_name}}}."

	end

	#: Warp

	def act_warp vessel_id # Move to the target vessel id.

		if @player.isLocked then return eror_locked(@player.print) end

		targetVessel = vessel_id.split(" ").last.to_i > 0 ? vesselWithId(vessel_id.split(" ").last.to_i) : vesselWithName(@world.to_a,vessel_id.split(" ").last.to_s)

		if !targetVessel then return eror_target(vessel_id) end

		@player.setParent(targetVessel.id)
		@world.save(@player.id,@player.render)

		return "You warped to #{targetVessel.print}."

	end

	def act_random none # Move inside a random vessel.
		
		tries = 0
		while tries < 20
			targetVessel = vesselWithId(rand(0...20000)) 
			if targetVessel.isEnterAllowedFor(@player)
				return act_warp(targetVessel.id.to_s)
			end
			tries +=1
		end
		return "Something went wrong."

	end

	def act_explore none # Embody a random vessel.
		
		candidates = []
		id = 0
		@world.to_a.each do |v|
			vessel = Vessel.new(id,v)
			if !vessel.isLocked && !vessel.isHidden && !vessel.isFrozen && id > 100
				if vessel.note.to_s.strip == "" then candidates.push(vessel) end
				if vessel.attribute.to_s == "" then candidates.push(vessel) end
			end
			id += 1
		end
		return candidates.length > 0 ? "::#{candidates.sample.id}" : "Could not find a suitable vessel."

	end

	#: Inventory

	def act_take visible_vessel_name # Send a visible vessel in your inventory.

		targetVessel = vesselWithName(@visible,visible_vessel_name)

		if !targetVessel then return eror_target(visible_vessel_name) end
		if targetVessel.isLocked then return eror_locked(targetVessel.print)  end

		targetVessel.setParent(@player.id)
		@world.save(targetVessel.id,targetVessel.render)

		return "You took #{targetVessel.print}."

	end

	def act_drop child_vessel_name # Send a vessel from your inventory in the parent vessel.

		targetVessel = vesselWithName(@inventory,child_vessel_name)

		if !targetVessel then return eror_target(child_vessel_name) end
		if targetVessel.isLocked then return eror_locked(targetVessel.print) end

		targetVessel.setParent(@player.parent)
		@world.save(targetVessel.id,targetVessel.render)

		return "You dropped #{targetVessel.print}."

	end

	def act_inventory none # Display vessels form your inventory.
		
		text = "Content: \n"
		@inventory.each do |vessel|
			text += "- #{vessel.print}\n"
		end
		return text

	end

	#: Programming

	def act_use visible_vessel_name # Run the target visible vessel program.

		targetVessel = vesselWithName(@visible,visible_vessel_name) # TODO: Merge Visible with Inventory

		if @player.isLocked then return eror_locked(@player.print) end
		if !targetVessel then return eror_target(visible_vessel_name) end
		if !targetVessel.program.isValid then return eror_program_invalid(targetVessel.print) end

		return targetVessel.program.run(@player,@inventory)

	end

	def act_program text # Add program to parent vessel.

		if !Program.new(text).isValid && text != "" then return eror_program_denied(text) end
		if @parent.isLocked then return eror_locked(@parent.print) end

		@parent.setProgram(text)
		@world.save(@parent.id,@parent.render)

		return text != "" ? "You added a program to #{@parent.print}." : "Removed the program of {{#{@parent.print}}}."

	end

	def act_call vessel_id # Activate remote vessel with Id.
		
		target = vessel_id.split(" ").last.to_i
		if target < 1 then return eror_id(vessel_id) end
		targetVessel = vesselWithId(target)

		if !targetVessel.program.isValid then return eror_program_invalid(targetVessel.print) end

		return targetVessel.program.run(@player,@inventory)

	end

	#: Security

	def act_lock none # Lock parent vessel.

		if @parent.owner != @player.id then return eror_owner(@parent.print) end

		@parent.setLock(1)
		@world.save(@parent.id,@parent.render)

		return "You locked #{@parent.print}"

	end

	def act_unlock none # Unlock parent vessel.
		
		if @parent.owner != @player.id then return eror_owner(@parent.print) end

		@parent.setLock(0)
		@world.save(@parent.id,@parent.render)

		return "You locked #{@parent.print}"

	end

	def act_hide none # Show current vessel to other vessels.
		
		if @player.isLocked then return eror_locked(@player.print) end

		@player.setHide(1)
		@world.save(@player.id,@player.render)

		return "You showed #{@player.print}"

	end

	def act_show none # Hide current vessel from other vessels.
		
		if @player.isLocked then return eror_locked(@player.print) end

		@player.setHide(0)
		@world.save(@player.id,@player.render)

		return "You hid #{@player.print}"

	end

	def act_destroy visible_vessel_name # Destroy target vessel.
		
		targetVessel = vesselWithName(@visible,visible_vessel_name)
		if !targetVessel then return eror_target(visible_vessel_name) end
		if targetVessel.owner != @player.id then return eror_owner(targetVessel.print) end

		targetVessel.destroy
		@world.save(targetVessel.id,targetVessel.render)

		return "You destroyed #{targetVessel.print}"

	end

	def act_purge none # Destroy visible owned vessels.

		return "Command is under development."

	end

end