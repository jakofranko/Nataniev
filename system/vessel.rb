#!/bin/env ruby

# The primordial entity within Nataniev
module Vessel

  attr_accessor :id, :name, :docs, :path, :site, :media_path, :actions, :corpse

  def initialize(_ = nil)

    @actions = {}
    @path = nil
    @media_path = nil
    @name = 'Unknown'
    @docs = 'No description'
    @corpse = nil

  end

  # Action

  def act(action_name, params = nil)

    return "#{name.capitalize} cannot #{action_name}." unless can(action_name)

    action = Object.const_get("Action#{action_name.capitalize}").new
    action.host = self

    action.act(params)

  end

  def can(action_name)

    @actions.each_value do |list|

      list.each do |action|

        return true if action.name.to_s == action_name.to_s.capitalize

      end

    end

    false

  end

  def install(category, action_name, corpse = nil)

    if category == :generic
      $nataniev.require('action', action_name)
    else
      load_action(action_name, category)
    end

    if Kernel.const_defined?("Action#{action_name.capitalize}") == false
      puts "Cannot install #{action_name}."
      return
    end

    @corpse = corpse if corpse
    @actions[category] = [] unless @actions[category]

    action = Object.const_get("Action#{action_name.capitalize}").new(self)
    @actions[category].push(action)

  end

  def load_action(name, category = :primary)

    # All vessels, except for the base Nataniev vessel, will probably
    # be located in a /vessels subdirectory. Actions will be in a sibling
    # directory to this, and so going up a level should find the correct action.
    # TODO: probably a more elegant way of handling this
    in_subdirectory = path == %r{/vessels$}
    path = if in_subdirectory || Dir.exist?("#{@path}/actions")
             "#{@path}/actions"
           else
             "#{@path}/../actions"
           end

    if category == :primary
      if File.exist?("#{path}/action.#{name}.rb")
        require_relative "#{path}/action.#{name}.rb"
        return
      end
    elsif File.exist?("#{path}/action.#{category}.#{name}.rb")
      # Target file
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

    raise "didn't find the file at #{path}. Category is #{category}. Name is #{name}."

  end

end

# An empty Vessel
class Ghost

  include Vessel

  def initialize(name = 'Unknown')

    super

    @name = name
    @docs = 'The Ghost vessel cannot act.'
    @path = File.expand_path(File.join(File.dirname(__FILE__), '/'))

    install(:generic, :help)

  end

end
