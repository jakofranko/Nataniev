require_relative "system/nataniev.rb"

class Nataniev

    attr_accessor :console_memory
    attr_accessor :console_bind

end

$nataniev = Nataniev.new
$nataniev.console_bind = ""
$nataniev.console_memory = {}

def help

    puts "To quit the Nataniev console, type 'exit'"
    puts "To bind vessels and their actions to the console, type bind <vessel> (<action>)"

end

puts "\n"
puts "  #{Desamber.new}"
puts "  Nataniev is listening...\n"
print $nataniev.console_bind != "" ? "<#{$nataniev.console_bind.colorize(2)}> " : "> "
while a = gets.strip

    begin

        if a == "" && $nataniev.console_bind == ""
            puts "[no input]"
        elsif a == "exit"
            break
        elsif a == "help"
            help
        elsif a.split(" ").first == "bind"
            $nataniev.console_bind = a.sub("bind","").strip
        else
            puts $nataniev.answer($nataniev.console_bind != "" ? "#{$nataniev.console_bind} #{a}" : a)
        end

        print $nataniev.console_bind != "" ? "<#{$nataniev.console_bind.colorize(2)}> " : "> "
    rescue Exception => e

        puts e.message
        e.backtrace.each do |trace|
            puts trace
        end

        print $nataniev.console_bind != "" ? "<#{$nataniev.console_bind.colorize(2)}> " : "> "
        next
    end

end
