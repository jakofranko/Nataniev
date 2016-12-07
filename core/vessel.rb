#!/bin/env ruby
# encoding: utf-8

module Vessel

  attr_accessor :name
  attr_accessor :docs
  attr_accessor :path
  attr_accessor :site
  attr_accessor :media_path
  attr_accessor :actions

  def initialize id = 0

    @actions = {}
    @path = nil
    @media_path = nil
    @name = "Unknown"
    @docs = "No description"
    @site = "htp://google.com"

  end

  # Action

  def act action_name, params = nil

    if Kernel.const_defined?("Action#{action_name.capitalize}") == false then puts "#{self.name.capitalize} cannot #{action_name}." ; return end

    return Object.const_get("Action#{action_name.capitalize}").new(self).act(params)

  end

  def install category,action_name

    if category == :generic then $nataniev.require("action",action_name) end

    if Kernel.const_defined?("Action#{action_name.capitalize}") == false then puts "Cannot install #{action_name}." ; return end

    if !actions[category] then actions[category] = [] end

    actions[category].push(Object.const_get("Action#{action_name.capitalize}"))

  end

end