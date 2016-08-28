#!/bin/env ruby
# encoding: utf-8

class Tasks

	include Vessel

	def display

		count = 0
		tasks.each do |k,v|
			count += v.length
		end
		return "> #{print.capitalize}, contains #{count} entries.\n"

	end

	def note

		return "This list is a series of issues found in XXIIVV.\n"+use

	end

	def use q = nil

		text = ""
		tasks.each do |k,v|
			if v.length < 1 then next end
			text += "\n#{v.length.to_s.append(" ",3)} #{k.upcase.to_s}\n\n"
			v.each do |task|
				text += "#{task}\n"
			end
		end

		return text

	end

	# tasks

	def tasks

		hash = {}

		@lexicon = En.new("lexicon").to_h
		@horaire = Di.new("horaire").to_a

		hash['unparented'] = list_unparented
		hash['brokenlinks'] = list_brokenlinks
		hash['stub'] = list_stubs

		hash['orphans'] = list_orphans
		hash['duplicates'] = list_duplicates
		hash['strangetasks'] = list_strangetasks
		hash['available'] = list_available
		hash['missingdays'] = list_missingdays

		return hash

	end

	def list_unparented

		array = []
		@lexicon.each do |term,content|
			if @lexicon[content["UNDE"].to_s.upcase] then next end
			if content["TYPE"].to_s.like("portal") == true then next end
			array.push("*".append(" ",4)+term.append(" ",20).capitalize)
		end
		return array

	end

	def list_brokenlinks

		array = []
		@lexicon.each do |term,content|
			search = (content["BREF"].to_s+content["LONG"].to_s).to_s.scan(/(?:\{\{)([\w\W]*?)(?=\}\})/)
	        search.each do |str,details|
	        	name = str.split("|").first
	        	link = str.split("|").last
	        	if name[0,1] == "!" then next end
	        	if link.include?("http") then next end
	        	if @lexicon[link.upcase] then next end
	            array.push("*   #{term.append(" ",20).capitalize}"+name.capitalize)
	        end
		end
		return array

	end

	def list_stubs

		array = []
		@lexicon.each do |term,content|
			if content["BREF"] then next end
	        array.push("#{content['LONG'].to_s.length.to_s.append(" ",4)}"+term.capitalize)
		end
		return array

	end

	def list_orphans

		array = []
		hash = {}
		@horaire.each do |log|
			term = log["TERM"].to_s
			if term == "" then next end
			if @lexicon[term.upcase] then next end
			hash[term] = hash[term].to_i + 1
		end

		hash.each do |k,v|
			array.push("#{v.to_s.append(' ',4)}"+k.capitalize)
		end
		return array
		
	end

	def list_duplicates

		array = []
		@used = []

		@horaire.each do |log|
			if !log["PICT"] then next end
			if @used.include?(log["PICT"].to_i)
				array.push("#{log['DATE'].append(" ",20)} #{log['PICT']}")
			end
			@used.push(log["PICT"].to_i)
		end
		return array
		
	end

	def list_strangetasks

		array = []
		@tasks = {}

		@horaire.each do |log|
			if !log['TASK'] then next end
			@tasks[log['TASK']] = @tasks[log['TASK']].to_i + 1
		end

		@tasks.each do |task,val|
			if val > 9 then next end
			array.push("#{val.to_s.append(' ',4)}"+task)
		end

		return array
		
	end

	def list_available

		array = []
		diaries = []
		@horaire.each do |log|
			if !log["PICT"] then next end
			diaries.push(log["PICT"].to_i)
		end

		diaries = diaries.sort

		i = 1
		while i < 999
			if !diaries.include?(i)
				array.push("#{i.to_s.append(' ',4)}Available")
				break
			end
			i += 1
		end
		return array

	end

	def list_missingterm

		array = []
		@tasks = {}

		@horaire.each do |log|
			if log['TERM'].to_s != "" then next end
			array.push("#{log['DATE'].append(" ",20)} #{log['NAME']} #{log['PICT']} #{log['TASK']} #{log['TEXT']}")
		end
		return array

	end

	def list_missingdays

		array = []
		dates = []
		@horaire.each do |log|
			dates.push(log['DATE'])
		end
		i = 0
		while i < (365 * 10)
			test2 = Time.now - (i * 24 * 60 * 60)
			y = test2.to_s[0,4]
			m = test2.to_s[5,2]
			d = test2.to_s[8,2]
			i += 1
			if !dates.include?("#{y} #{m} #{d}")
				array.push("    #{y} #{m} #{d}")
			end
		end
		return array

	end

end