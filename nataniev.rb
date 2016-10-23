#!/bin/env ruby
# encoding: utf-8

# You see nothing, enter the nothing.

class Nataniev

  attr_accessor :time
  attr_accessor :path
  attr_accessor :actor

  def initialize

    @time    = Time.new
    @path    = File.expand_path(File.join(File.dirname(__FILE__), "/"))

    @id      = nil
    @player  = nil
    @parade  = nil 

    load path+"/system/tools.rb"

    load path+"/core/action.rb"
    load path+"/core/corpse.rb"
    load path+"/core/vessel.rb"

    load_folder path+"/system/*"

  end

  def console
    
    @console = @console ? @console : Console.new
    return @console

  end

  def parade

    @parade = @parade ? @parade : Di.new("paradise")
    return @parade

  end

  def answer q = nil

    parts  = q.split(" ")
    actor  = parts[0]
    action = parts[1] ? parts[1] : "look"
    params = q.sub("#{actor}","").sub("#{action}","").strip

    return operate(actor,action,params)

  end

  def operate actor, action, params

    require("action",action)

    actor_vessel = actor.to_i > 0 ? make_vessel(actor) : make_anonym(actor)

    if !actor_vessel then return "? #{actor} is not a valid vessel id." else @actor = actor_vessel end

    # Default
    vessel = actor_vessel
    if vessel && vessel.default_actions.respond_to?("#{action}") then return vessel.default_actions.send("#{action}",params).strip end
    # Self
    vessel = actor_vessel
    if vessel && vessel.actions.respond_to?("#{action}") then return vessel.actions.send("#{action}",params).strip end
    # Parent
    vessel = actor_vessel.parent_vessel
    if vessel && vessel.parent_actions.respond_to?("#{action}") then return vessel.parent_actions.send("#{action}",params).strip end
    # Target
    vessel = actor_vessel.target_vessel(params)
    if vessel && vessel.target_actions.respond_to?("#{action}") then return vessel.target_actions.send("#{action}",params).strip end
    # Presence
    vessel = actor_vessel.presence_vessel(action)
    if vessel then return vessel.presence_actions.send("#{action}",params).strip end
    
    return "? #{action} is not a valid action. Use {{help}} to find the valid actions for the #{actor_vessel.class.to_s.downcase} vessel."

  end

  def find_available_id

    id = 0
    while id < 30000
      id +=1
      if parade.to_a[id]['CODE'] then next end
      return id
    end

    return nil

  end

  def make_vessel id

    line = parade.line(id.to_i) ; if !line then return nil end
    instance = line['CODE'] ? line['CODE'].split("-")[3].downcase : "ghost"
    return make_vessel_type(instance).new(id.to_i,line)

  end

  def make_anonym vessel_name

    return make_vessel_type(vessel_name).new

  end

  def make_vessel_type vessel_name

    Dir["#{path}/core/vessel/*"].each do |vessel_file_path|
      vessel_file = vessel_file_path.split("/").last
      if vessel_file.like("vessel.#{vessel_name}")
        load("#{path}/core/vessel/vessel.#{vessel_name.downcase}/vessel.rb")
        return Object.const_get(vessel_name.capitalize)
      end
    end

    # Default to ghost

    require "vessel","ghost"
    return Ghost

  end

  def require cat,name

    if File.exist?("core/#{cat}/#{cat}.#{name}/#{cat}.rb")
      require_relative "core/#{cat}/#{cat}.#{name}/#{cat}.rb"
    end

    if File.exist?("core/#{cat}/#{cat}.#{name}.rb")
      require_relative "core/#{cat}/#{cat}.#{name}.rb"
    end

    if File.exist?("core/#{cat}/core.#{name}.rb")
      require_relative "core/#{cat}/core.#{name}.rb"
    end
    
  end

end