#!/bin/env ruby
# encoding: utf-8

def list_available

  @horaire = Di.new("horaire","#{$nataniev.path}/instances/instance.oscea").to_a

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

class Horai

  include Vessel

  # Actions

  class PassiveActions

    include ActionCollection

    def answer q = nil

      return "! The next available id is ##{list_available}."

    end

  end

  def passive_actions ; return PassiveActions.new(self,self) end

  class TargetActions

    include ActionCollection

    def browse q = nil

      @horaire = Di.new("horaire","#{$nataniev.path}/instances/instance.oscea").to_a

      hash = {}

      hash['duplicates'] = list_duplicates
      hash['strangetasks'] = list_strangetasks
      hash['missingdays'] = list_missingdays

      text = ""

      if hash['duplicates'].length > 0 then text += "> #{@actor.print.capitalize}, duplicate log: #{hash['duplicates'].first}.\n" end
      if hash['strangetasks'].length > 0 then text += "> #{@actor.print.capitalize}, strange log: #{hash['strangetasks'].first}.\n" end
      if hash['missingdays'].length > 0 then text += "> #{@actor.print.capitalize}, missing log: #{hash['missingdays'].first}.\n" end

      return "#{text}! The next available id is ##{list_available}."

    end

  end

  def target_actions ; return TargetActions.new($nataniev.actor, self) end

  # Overrides
  
  def display

    @horaire = Di.new("horaire","#{$nataniev.path}/instances/instance.oscea").to_a
    
    return "> #{print.capitalize}, contains #{@horaire.length} logs.\n"

  end

end