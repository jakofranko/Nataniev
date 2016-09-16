#!/bin/env ruby
# encoding: utf-8

module ActionDestroy

  def destroy q = nil

  	if @target.owner != @actor.id then return error_owner(v.name) end

    return @target.destroy ? "! You destroyed the #{@target.name}." : "! You cannot destroy the #{@target.name}."

  end

end