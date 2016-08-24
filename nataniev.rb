#!/bin/env ruby
# encoding: utf-8

$nataniev_path = File.expand_path(File.join(File.dirname(__FILE__), "/"))

load "console/console.rb"
load "#{$nataniev_path}/library/di.parser.rb"
load "#{$nataniev_path}/system/tools.rb"

load "#{$nataniev_path}/system/vessel.rb"
load "#{$nataniev_path}/vessels/behol.rb"
load "#{$nataniev_path}/vessels/basic.rb"

class Nataniev

  def initialize

  	@console = Console.new
    @player  = nil
    @parade  = nil 

  end

  def parade  ; return @parade  end
  def player  ; return @player  end
  def console ; return @console end

  def set_player id

    if id.to_i > 0
      @parade = Di.new("paradise")
      @player = make_vessel(id)
    else
      @player = Behol.new
    end

  end

  def answer query

    if !@player then return "Vessel required" end
    query = query == "" ? "look" : query

    action = query.split(" ").first.strip
    params = query.sub(action,"").strip

    if @player.respond_to?("__#{action}")
      return @player.send("__#{action}",params).strip
    else
      return "Unknown action: #{action}"
    end

  end

  def completion

  	hash = {}
  	hash["test"] = "something"
  	return hash

  end

  def make_vessel id

    return Basic.new(id.to_i,@parade.line(id.to_i))

  end

end