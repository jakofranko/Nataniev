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
    
    load path+"/system/action.rb"
    load path+"/system/corpse.rb"
    load path+"/system/vessel.rb"
    load path+"/system/memory.rb"

    load_folder path+"/vessel/vessel.ghost/*"
    load_folder path+"/corpse/corpse.base/*"

  end

  def answer q = nil

    parts   = q.split(" ")
    vessel  = parts[0] ? parts[0] : "ghost"
    action  = parts[1] ? parts[1].to_sym : :help
    params  = q.sub("#{vessel} #{action}","").strip

    # Summon
    spirit  = summon(vessel)
    @vessel = spirit ? spirit.new : nil

    return @vessel ? @vessel.act(action,params) : "Could not summon the #{vessel} vessel."

  end

  def summon vessel_name

    if File.exist?("#{path}/vessel/vessel.#{vessel_name.downcase}/vessel.rb") then load("#{path}/vessel/vessel.#{vessel_name.downcase}/vessel.rb") end    
    if File.exist?("#{path}/vessel/vessel.#{vessel_name.downcase}.rb") then load("#{path}/vessel/vessel.#{vessel_name.downcase}.rb") end    

    if !Kernel.const_defined?("Vessel#{vessel_name.capitalize}") then puts "Could not create the #{vessel_name} vessel." ; return nil end

    return Object.const_get("Vessel"+vessel_name.to_s.capitalize)

  end

  #

  def require cat,name

    # Target file
    if File.exist?("#{path}/#{cat}/#{cat}.#{name}.rb")
      require_relative "#{path}/#{cat}/#{cat}.#{name}.rb"
    # Target folder
    elsif File.exist?("#{path}/#{cat}/#{cat}.#{name}/#{cat}.rb")
      require_relative "#{path}/#{cat}/#{cat}.#{name}/#{cat}.rb"
    # Core file
    elsif File.exist?("#{path}/#{cat}/core.#{name}.rb")
      require_relative "#{path}/#{cat}/core.#{name}.rb"
    # Core folder
    elsif File.exist?("#{path}/#{cat}/core.#{name}/#{cat}.rb")
      require_relative "#{path}/#{cat}/core.#{name}/#{cat}.rb"
    end
    
  end

end

# Loaders

def load_any path, file

  if file.to_s == "" then return end
  if !File.exist?("#{path}/#{file.downcase}.rb") then return end
  load "#{path}/#{file.downcase}.rb"

end

def load_folder path

  Dir[path].each do |file_name|
    if file_name.to_s.length < 5 then next end  
    if file_name[-3,3] != ".rb" then next end
    load file_name
  end

end

def require_any path, file

  if file.to_s == "" then return end
  if !File.exist?("#{path}/#{file.downcase}.rb") then return end
  require "#{path}/#{file.downcase}.rb"

end

def require_folder path

  Dir[path].each do |file_name|
    if file_name.to_s.length < 5 then next end  
    if file_name[-3,3] != ".rb" then next end
    require file_name
  end

end