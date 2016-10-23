#!/bin/env ruby
# encoding: utf-8

class Basic

  include Vessel

  class Actions

    include ActionCollection

    include ActionLook

    include ActionCreate
    include ActionLeave

    include ActionWarp
    include ActionCall

    include ActionTransform
    include ActionInventory

  end

  class ParentActions

    include ActionCollection

    include ActionNote
    include ActionCast

  end

  class TargetActions

    include ActionCollection

    include ActionEnter
    include ActionBecome

    include ActionTake
    include ActionDrop

    include ActionShow
    include ActionHide

    include ActionLock
    include ActionUnlock

    include ActionExamine
    include ActionUse

    include ActionDestroy

  end

  def actions ; return Actions.new($nataniev.actor, self) end
  def parent_actions ; return ParentActions.new($nataniev.actor, self) end
  def target_actions ; return TargetActions.new($nataniev.actor, self) end

end