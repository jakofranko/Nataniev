#!/bin/env ruby

# You see nothing, enter the nothing.
begin
  require_relative 'system/nataniev'

  $nataniev = Nataniev.new
  puts $nataniev.answer(ARGV.join(' '))
rescue StandardError => e
  puts e.message
  e.backtrace.each do |trace|

    puts trace

  end
end
