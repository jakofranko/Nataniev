#!/bin/env ruby
# encoding: utf-8

# You see nothing, enter the nothing.

begin

require_relative "system/nataniev.rb"

$nataniev = Nataniev.new
puts $nataniev.answer(ARGV.join(" "))

rescue Exception => e

    puts e.message
    e.backtrace.each do |trace|
        puts trace
    end

end
