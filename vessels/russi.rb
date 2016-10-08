#!/bin/env ruby
# encoding: utf-8

class Russi

  include Vessel

  class PassiveActions

    include ActionCollection

    def answer q = nil

      word = Di.new("russian.vocabulary").to_a.sample
      return "! The Russian word \"#{word['RUSSIAN']}\" means \"#{word['ENGLISH']}\"."

    end

  end

  def passive_actions ; return PassiveActions.new(self,self) end

  # Actions

  class PresenceActions

    include ActionCollection
    include ActionTranslate

  end

  def presence_actions ; return PresenceActions.new($nataniev.actor, self) end

  # Overrides
  
  def display

    word = Di.new("russian.vocabulary").to_a.sample

    return "- #{print.capitalize}, translates \"#{word['RUSSIAN']}\" as \"#{word['ENGLISH']}\".\n"

  end

end