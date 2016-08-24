#!/bin/env ruby
# encoding: utf-8

$nataniev_path = File.expand_path(File.join(File.dirname(__FILE__), "/"))

class Nataniev

  def initialize

  	load "console/console.rb"
  	@console = Console.new

  end

  def console ; return @console end

  def answer query

  	return "hey #{query}"

  end

  def completion

  	hash = {}
	hash["test"] = "something"
	return hash

  end

end