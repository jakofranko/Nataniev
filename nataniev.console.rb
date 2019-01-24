#!/bin/env ruby
# encoding: utf-8

# You see nothing, enter the nothing.

begin

require_relative "system/nataniev.rb"
	
class Nataniev

  attr_accessor :console_memory
  attr_accessor :console_bind

end

$nataniev = Nataniev.new
$nataniev.console_bind = ""
$nataniev.console_memory = {}

puts  "\n  #{Desamber.new}"
print "  Nataniev is listening..\n\n> "

while a = gets.strip

  # Exit
  if a == "exit"
    exit 0
    return false
  
  # Bind
  elsif a.split(" ").first == "bind"
    $nataniev.console_bind = a.sub("bind","").strip
    print $nataniev.console_bind != "" ? "<#{$nataniev.console_bind.colorize(2)}> " : "> "

  # Answer
  else
    puts $nataniev.answer($nataniev.console_bind != "" ? "#{$nataniev.console_bind} #{a}" : a)
    print $nataniev.console_bind != "" ? "<#{$nataniev.console_bind.colorize(2)}> " : "> "
  end

end

rescue Exception

  puts "\n\n#{$!.to_s.gsub('`','').gsub('\'','').capitalize}\n\n"
  $@.each do |e|
    line = e.scan(/(?:\:)([\w\W]*?)(?=\:)/).first.first
    file = e.split("/").last.split(":").first.gsub(".rb","").strip
    func = e.split("`").last.gsub("'","")
    puts "#{file.append(' ',20)} #{line.prepend(' ',3)} #{func.append(' ',20)}"
  end
  puts "\n"

end