#!/bin/env ruby
# encoding: utf-8

class Haven

  include Vessel

  # Actions

  class Actions

    include ActionCollection

  end

  class ParentActions

    include ActionCollection

  end

  class TargetActions

    include ActionCollection

    include ActionEnter
    include ActionUse

  end

  def actions ; return Actions.new($nataniev.actor, self) end
  def parent_actions ; return ParentActions.new($nataniev.actor, self) end
  def target_actions ; return TargetActions.new($nataniev.actor, self) end
  
end