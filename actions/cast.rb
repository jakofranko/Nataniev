#!/bin/env ruby
# encoding: utf-8

module ActionCast

  def cast q = nil

  	instance_name = q.to_s.split(" ").last.to_s.upcase

  	if @target.owner != @actor.id then return error_owner(v.name) end

  	if instance_name.length != 5 then return "! #{instance_name.upcase} is not a vessel type." end
	if !File.exist?("#{$nataniev_path}/vessels/#{instance_name}.rb") then return "! #{instance_name} is not a valid instance cast." end

    return @target.set_instance(instance_name) ? "! You casted #{@target.print} into a #{instance_name.upcase} vessel." : "! The #{@target.name} is locked."
    
  end

end