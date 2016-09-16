#!/bin/env ruby
# encoding: utf-8

class Forum

  include Vessel

  # Actions

  class Actions

    include ActionCollection

  end

  class ParentActions

    include ActionCollection
    include ActionSay

  end

  class TargetActions

    include ActionCollection

    include ActionEnter
    include ActionUse

  end

  def actions ; return Actions.new($nataniev.actor, self) end
  def parent_actions ; return ParentActions.new($nataniev.actor, self) end
  def target_actions ; return TargetActions.new($nataniev.actor, self) end
      
  # Overrides
  
  def note

    @forum = Di.new("forum")
    
    sorted = {}
    count = 0
    @forum.to_a.reverse.each do |line|
      if count > 15 then break end
      parts = line['CODE'].split("-")
      if parts.first.to_i != id then next end
      time = parts.last
      if !sorted[Timestamp.new(time).ago] then sorted[Timestamp.new(time).ago] = [] end
      sorted[Timestamp.new(time).ago].push(line)
      count += 1
    end

    text = "The #{name} is a forum, where messages can be left to other vessels using the \"say\" command.\n"
    sorted.to_a.reverse.each do |ago,messages|
      text += "# Written #{ago}\n"
      messages.reverse.each do |message|
        text += "- #{message['TEXT']}, said the #{message['NAME']}\n"
      end
    end

    return text

  end

end