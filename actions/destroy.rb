#!/bin/env ruby
# encoding: utf-8

module ActionDestroy

  def destroy q = nil

    v = find_present_vessel(q) ; if !v then return error_target(q) end

    if v.owner != id then return error_owner end

    return v.destroy ? "! You destroyed the #{v.name}." : "! You cannot destroy the #{v.name}."

  end

end