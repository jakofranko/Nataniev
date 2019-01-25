require_relative "system/nataniev.rb"

class Nataniev

    attr_accessor :console_memory
    attr_accessor :console_bind

end

def oroborus

    while a = gets.strip

        if a == "exit"
            exit 0
            return false
        elsif a.split(" ").first == "bind"
            $nataniev.console_bind = a.sub("bind","").strip
            print $nataniev.console_bind != "" ? "<#{$nataniev.console_bind.colorize(2)}> " : "> "
        else
            puts $nataniev.answer($nataniev.console_bind != "" ? "#{$nataniev.console_bind} #{a}" : a)
            print $nataniev.console_bind != "" ? "<#{$nataniev.console_bind.colorize(2)}> " : "> "
        end

    end

end

begin

    $nataniev = Nataniev.new
    $nataniev.console_bind = ""
    $nataniev.console_memory = {}

    puts "\n"
    puts "  #{Desamber.new}"
    puts "  Nataniev is listening..."
    print "\n> "

    oroborus

rescue Exception => e
    puts e

    puts "\n\n#{$!.to_s.gsub('`','').gsub('\'','').capitalize}\n\n"
    $@.each do |e|
        line = e.scan(/(?:\:)([\w\W]*?)(?=\:)/).first.first
        file = e.split("/").last.split(":").first.gsub(".rb","").strip
        func = e.split("`").last.gsub("'","")
        puts "#{file.append(' ',20)} #{line.prepend(' ',3)} #{func.append(' ',20)}"
    end
    puts "\n"

    oroborus
end
