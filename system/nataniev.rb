#!/bin/env ruby

# You see nothing, enter the nothing.
class Nataniev

  attr_accessor :time, :path, :actor, :vessels

  def initialize

    @time = Time.new
    @path = File.expand_path(File.join(File.dirname(__FILE__), '/')) + '/..'
    @vessels = {}

    load "#{@path}/system/action.rb"
    load "#{@path}/system/corpse.rb"
    load "#{@path}/system/vessel.rb"
    load "#{@path}/system/memory.rb"

    load_folder "#{@path}/corpse/corpse.base/*"
    load_folder "#{@path}/action/*"

  end

  def answer(q = nil)

    parts   = q.split(' ')
    invoke  = parts[0] || 'ghost'
    action  = parts[1] ? parts[1].to_sym : :help
    params  = q.sub("#{invoke} #{action}", '').strip

    summon(invoke).act(action, params)

  end

  def summon(vessel)

    name = vessel.to_sym
    return @vessels[name] if @vessels[name]

    load_any("#{@path}/vessel/vessel.#{name.downcase}", 'vessel')

    @vessels[name] = Object.const_get("Vessel#{name.downcase.capitalize}").new || Ghost.new(name)

    @vessels[name]

  end

  def vessel

    @vessels.first

  end

  #

  def require(cat, name)

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

def load_any(path, file)

  return if file.to_s == ''
  return unless File.exist?("#{path}/#{file.downcase}.rb")

  load "#{path}/#{file.downcase}.rb"

end

def load_folder(path)

  Dir[path].each do |file_name|

    next if file_name.to_s.length < 5
    next if file_name[-3, 3] != '.rb'

    load file_name

  end

end

def require_any(path, file)

  return if file.to_s == ''
  return unless File.exist?("#{path}/#{file.downcase}.rb")

  require "#{path}/#{file.downcase}.rb"

end

def require_folder(path)

  Dir[path].each do |file_name|

    next if file_name.to_s.length < 5
    next if file_name[-3, 3] != '.rb'

    require file_name

  end

end
