#!/bin/env ruby
# encoding: utf-8

class Behol

  include Vessel

  def print ; return "the Beholder" end
  def connect q = nil ; return "#{print.capitalize} is online." end

  def __look q = nil ; return "#{print.capitalize} is blind." end

  def __http q = nil

    instance = q.split(" ").first
    params   = q.sub(instance,"").to_s.strip

    if !File.exist?("#{$nataniev_path}/instances/instance.#{instance}/vessel.rb") then return "#{instance.capitalize} is unfound." end

    load "#{$nataniev_path}/instances/instance.#{instance}/vessel.rb"

    vessel = Object.const_get(instance.capitalize).new()

    if !vessel.respond_to?("http") then return "#{instance.capitalize} doesn't know http." end

    return vessel.send("http",params).strip

  end
  
end