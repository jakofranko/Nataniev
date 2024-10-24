#!/bin/env ruby
# encoding: utf-8

module Vessel

  attr_accessor :id
  attr_accessor :name
  attr_accessor :docs
  attr_accessor :path
  attr_accessor :site

  attr_accessor :media_path
  attr_accessor :actions
  attr_accessor :corpse

  def initialize id = 0

    @actions = {}
    @path = nil
    @media_path = nil
    @name = "Unknown"
    @docs = "No description"
    @corpse = nil

  end

  # Action

  def act action_name, params = nil

    if !can(action_name) then return "#{self.name.capitalize} cannot #{action_name}." end

    action = Object.const_get("Action#{action_name.capitalize}").new
    action.host = self

    return action.act(params)

  end

  def can action_name

    @actions.each do |cat, list|
        list.each do |action|
            if "#{action.name}" == action_name.to_s.capitalize then return true end
        end
    end

    return false

    # Override installation
    return Kernel.const_defined?("Action#{action_name.capitalize}")

  end

  def install category, action_name, corpse = nil

    if category == :generic then
        $nataniev.require("action", action_name)
    else
        load_action(action_name, category)
    end


    if Kernel.const_defined?("Action#{action_name.capitalize}") == false then puts "Cannot install #{action_name}." ; return end

    if corpse then @corpse = corpse end
    if !@actions[category] then @actions[category] = [] end

    action = Object.const_get("Action#{action_name.capitalize}").new(self)
    @actions[category].push(action)

  end

  def load_action name, category = :primary



    # All vessels, except for the base Nataniev vessel, will probably
    # be located in a /vessels subdirectory. Actions will be in a sibling
    # directory to this, and so going up a level should find the correct action.
    # TODO: probably a more elegant way of handling this
    in_subdirectory = /\/vessels$/ == path
    if in_subdirectory or Dir.exist?(@path + '/actions') then
      path = @path + "/actions"
    else
      path = @path + "/../actions"
    end

    if category == :primary
        if File.exist?("#{path}/action.#{name}.rb")
            require_relative "#{path}/action.#{name}.rb"
            return
        end
    else
        # Target file
        if File.exist?("#{path}/action.#{category}.#{name}.rb")
            require_relative "#{path}/action.#{category}.#{name}.rb"
            return
        # Target folder
        elsif File.exist?("#{path}/#{category}/action.#{name}.rb")
            require_relative "#{path}/#{category}/action.#{name}.rb"
            return
        elsif File.exist?("#{path}/#{category}.#{name}.rb")
            require_relative "#{path}/#{category}.#{name}.rb"
            return
        end
    end

    raise "didn't find the file at #{path}. Category is #{category}. Name is #{name}."

  end

end

class Ghost

  include Vessel

  def initialize name = "Unknown"

    super

    @name = name
    @docs = "The Ghost vessel cannot act."
    @path = File.expand_path(File.join(File.dirname(__FILE__), "/"))

    install(:generic,:help)

  end

end
