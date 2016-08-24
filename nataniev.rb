#!/bin/env ruby
# encoding: utf-8

$nataniev_path = File.expand_path(File.join(File.dirname(__FILE__), "/"))

load "#{$nataniev_path}/library/di.parser.rb"

load "#{$nataniev_path}/system/vessel.rb"
load "#{$nataniev_path}/vessels/behol.rb"
load "#{$nataniev_path}/vessels/basic.rb"

class Nataniev

  def initialize

  	load "console/console.rb"
  	@console = Console.new
    @vessel  = nil
    @parade  = nil 

  end

  def parade  ; return @parade  end
  def vessel  ; return @vessel  end
  def console ; return @console end

  def set_vessel id

    if id.to_i > 0
      @parade = Di.new("paradise")
      @vessel = Basic.new(id.to_i,@parade.line(id.to_i))
    else
      @vessel = Behol.new
    end

  end

  def answer query

    if !@vessel then return "Vessel required" end

  	return "#{@vessel.name}: #{query}"

  end

  def completion

  	hash = {}
  	hash["test"] = "something"
  	return hash

  end

end