#!/bin/env ruby
# encoding: utf-8

module ActionHttp

  def http q = nil

    instance = q.split(" ").first
    params   = q.sub(instance,"").to_s.strip

    if !File.exist?("#{$nataniev_path}/instances/instance.#{instance}/vessel.rb") then return "#{instance.capitalize} is unfound." end

    load "#{$nataniev_path}/instances/instance.#{instance}/vessel.rb"

    vessel = Object.const_get(instance.capitalize).new

    if !vessel.actions.respond_to?("http",params) then return "#{instance.capitalize} doesn't know http." end

    return vessel.actions.send("http",params).strip

  end

end