#!/bin/env ruby
# encoding: utf-8

# You see nothing, enter the nothing.

class Nataniev

  attr_accessor :time
  attr_accessor :path
  attr_accessor :actor
  attr_accessor :vessel

  def initialize

    @time    = Time.new
    @path    = File.expand_path(File.join(File.dirname(__FILE__), "/"))+"/.."
    
    load path+"/system/tools.rb"
    load path+"/core/action.rb"
    load path+"/core/corpse.rb"
    load path+"/core/vessel.rb"
    load path+"/core/memory.rb"

    load_folder path+"/system/*"

  end

  def parade

    @parade = @parade ? @parade : Memory_Array.new("paradise")
    return @parade

  end

  def answer q = nil

    parts   = q.split(" ")
    actor   = parts[0]
    action  = parts[1] ? parts[1].to_sym : :help
    params  = q.sub("#{actor}","").sub("#{action}","").strip
    @vessel = make_vessel(actor).new

    return vessel.act(action,params)

  end

  def make_vessel vessel_name

    Dir["#{path}/core/vessel/*"].each do |vessel_file_path|
      vessel_file = vessel_file_path.split("/").last
      if vessel_file.like("core.#{vessel_name}.rb") && File.exist?("#{path}/core/vessel/core.#{vessel_name.downcase}.rb")
        load("#{path}/core/vessel/core.#{vessel_name.downcase}.rb")
        if Kernel.const_defined?("Vessel#{vessel_name.capitalize}") == true
          return Object.const_get("Vessel"+vessel_name.capitalize)
        end
      elsif vessel_file.like("vessel.#{vessel_name}") && File.exist?("#{path}/core/vessel/vessel.#{vessel_name.downcase}/vessel.rb")
        load("#{path}/core/vessel/vessel.#{vessel_name.downcase}/vessel.rb")
        if Kernel.const_defined?("Vessel#{vessel_name.capitalize}") == true
          return Object.const_get("Vessel"+vessel_name.capitalize)
        end
      end
    end

    require :vessel,:ghost
    require :action,:look
    require :action,:help

    return VesselGhost

  end

  #

  def require cat,name

    # Target file
    if File.exist?("#{path}/core/#{cat}/#{cat}.#{name}.rb")
      require_relative "#{path}/core/#{cat}/#{cat}.#{name}.rb"
    # Target folder
    elsif File.exist?("#{path}/core/#{cat}/#{cat}.#{name}/#{cat}.rb")
      require_relative "#{path}/core/#{cat}/#{cat}.#{name}/#{cat}.rb"
    # Core file
    elsif File.exist?("#{path}/core/#{cat}/core.#{name}.rb")
      require_relative "#{path}/core/#{cat}/core.#{name}.rb"
    # Core folder
    elsif File.exist?("#{path}/core/#{cat}/core.#{name}/#{cat}.rb")
      require_relative "#{path}/core/#{cat}/core.#{name}/#{cat}.rb"
    end
    
  end

end