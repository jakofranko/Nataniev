#!/bin/env ruby
# encoding: utf-8

class Horai

	include Vessel

	def display

		@horaire = Di.new("horaire").to_a
			
		hash = {}

		hash['duplicates'] = list_duplicates
		hash['strangetasks'] = list_strangetasks
		hash['missingdays'] = list_missingdays

		if hash['duplicates'].length > 0 then return "> #{print.capitalize}, duplicate log: #{hash['duplicates'].first}.\n" end
		if hash['strangetasks'].length > 0 then return "> #{print.capitalize}, strange log: #{hash['strangetasks'].first}.\n" end
		if hash['missingdays'].length > 0 then return "> #{print.capitalize}, missing log: #{hash['missingdays'].first}.\n" end
		
		return "> #{print.capitalize}, contains #{@horaire.to_a.length} logs.\n"

	end

	def use q = nil

		@horaire = Di.new("horaire").to_a

		return "The next available id is ##{list_available}."

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
				array.push("#{y} #{m} #{d}")
			end
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
				return i
			end
			i += 1
		end
		return array

	end

end