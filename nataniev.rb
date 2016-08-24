#!/bin/env ruby
# encoding: utf-8

$nataniev_path = File.expand_path(File.join(File.dirname(__FILE__), "/"))

load "#{$nataniev_path}/vessels/vessel.rb"

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

    if vessel.to_i > 0
      @parade = Di.load("paradise")
      @vessel = Basic.new(id,@parade.line(id))
    else
      @vessel = Beholder.new
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