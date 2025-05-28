#!/bin/env ruby

# You see nothing, enter the nothing.

require_relative 'system/nataniev'

$nataniev = Nataniev.new
minute = Time.now.strftime('%M').to_i

# Bots
puts $nataniev.summon('thewillthewisp').act(:tweet) if minute == 31

