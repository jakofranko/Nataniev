#!/bin/env ruby
# encoding: utf-8

class Basic

  include Vessel

  # Setters

  def set_lock      val ; if owner != $nataniev.actor.id then return false end ; @is_locked = val ; save ;  return true end
  def set_hide      val ; if owner != $nataniev.actor.id then return false end ; @is_hidden = val ; save ;  return true end
  def set_quiet     val ; if owner != $nataniev.actor.id then return false end ; @is_quiet = val ; save ;   return true end

  def set_name      val ; if is_locked then return false end ; @name = val ; save ;      return true end
  def set_attribute val ; if is_locked then return false end ; @attribute = val ; save ; return true end
  def set_parent    val ; if is_locked then return false end ; @parent = val ; save ;    return true end
  def set_program   val ; if is_locked then return false end ; @program = val ; save ;   return true end
  def set_note      val ; if is_locked then return false end ; @note = val ; save ;      return true end

  def destroy ; @isDestroyed = true ; save ; end

  class Actions

    include ActionCollection

    include ActionLook

    include ActionCreate
    include ActionLeave

    include ActionWarp
    include ActionCall

    include ActionInventory

  end

  class ParentActions

    include ActionCollection

    include ActionNote
    include ActionName

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

    include ActionUse

    include ActionDestroy

  end

  def actions ; return Actions.new($nataniev.actor, self) end
  def parent_actions ; return ParentActions.new($nataniev.actor, self) end
  def target_actions ; return TargetActions.new($nataniev.actor, self) end

end