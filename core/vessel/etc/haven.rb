#!/bin/env ruby
# encoding: utf-8

class Haven

  include Vessel

  # Actions

  class TargetActions

    include ActionCollection

    include ActionEnter
    include ActionUse

  end
  
  def target_actions ; return TargetActions.new($nataniev.actor, self) end
  
end