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

  def actions ; return Actions.new(self) end
  def via_actions ; return Actions.new(self) end

  class Actions

    include ActionCreate
    include ActionBecome
    include ActionEnter
    include ActionLeave

    include ActionWarp
    include ActionFind

    include ActionTakeDrop
    include ActionShowHide
    include ActionLockUnlock

    include ActionInventory
    include ActionHelp

    include ActionNote
    include ActionName

    include ActionUse
    include ActionCall

    include ActionSonar

    def initialize actor

      @actor = actor

    end

  end


end