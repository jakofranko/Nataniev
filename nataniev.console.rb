require_relative "system/nataniev.rb"

class Nataniev

    attr_accessor :console_memory
    attr_accessor :console_bind

end

def ouroborus

    print $nataniev.console_bind != "" ? "<#{$nataniev.console_bind.colorize(2)}> " : "> "
    while a = gets.strip

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

    end

end

def help

    puts "To quit the Nataniev console, type 'exit'"
    puts "To bind vessels and their actions to the console, type bind <vessel> (<action>)"

end

begin

    $nataniev = Nataniev.new
    $nataniev.console_bind = ""
    $nataniev.console_memory = {}

    puts "\n"
    puts "  #{Desamber.new}"
    puts "  Nataniev is listening...\n"

    ouroborus

rescue Exception => e
    puts "There was an exception..."
    puts "#{$!}"
    puts "\n\n#{$!.to_s.gsub('`','').gsub('\'','').capitalize}\n\n"
    $@.each do |e|
        line = e.scan(/(?:\:)([\w\W]*?)(?=\:)/).first.first
        file = e.split("/").last.split(":").first.gsub(".rb","").strip
        func = e.split("`").last.gsub("'","")
        puts "#{file.append(' ',20)} #{line.prepend(' ',3)} #{func.append(' ',20)}"
    end
    puts "\n"

    ouroborus
end
