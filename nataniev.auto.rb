#!/bin/env ruby
# encoding: utf-8

# You see nothing, enter the nothing.

require_relative "system/nataniev.rb"

$nataniev = Nataniev.new
minute = Time.now.strftime("%M").to_i

# Bots
if minute == 16 then puts $nataniev.summon("dictionarism").act(:tweet) end
if minute == 26 then puts $nataniev.summon("thewillthewisp").act(:tweet) end