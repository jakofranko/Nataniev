#!/bin/env ruby
# encoding: utf-8

# You see nothing, enter the nothing.

begin

require_relative "system/nataniev.rb"

$nataniev = Nataniev.new
puts $nataniev.answer(ARGV.join(" "))

rescue Exception

  puts "\n<pre style='margin:100px'>\n\n#{$!.to_s.gsub('`','').gsub('\'','').capitalize}\n\n"
  $@.each do |e|
    line = e.scan(/(?:\:)([\w\W]*?)(?=\:)/).first.first
    file = e.split("/").last.split(":").first.gsub(".rb","").strip
    func = e.split("`").last.gsub("'","")
    puts "#{file.append(' ',20)} #{line.prepend(' ',3)} #{func.append(' ',20)}"
  end
  puts "\n</pre>"

end