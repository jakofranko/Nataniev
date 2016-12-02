#!/bin/env ruby
# encoding: utf-8

require 'io/console'

class Console

  def start v = nil

    $nataniev.require("corpse","console")

    system("clear")
    @text = ""
    @last = ""

    puts "\n\rConnected.\r"
    print "\n\r> "

  end

  def validate query = nil
    
    print "\n"
    $nataniev.answer(query).to_s.lines.each do |line|
      print "\r#{line.strip}\n"
    end
    print "\r> \e "
    
    @last = query.length > 1 ? query : @last
    @text = ""
    
  end

  # Terminal

  def listen

    c = read_char

    case c
      when " "
        @text += " "
      when "\t" # Tab
        @text = autocomplete
      when "\r" # Enter
        validate(@text)
      when "\e" # Escape
        exit 0 ; return false
      when "\e[A" # Arrow Up
        @text = @last
      when "\e[B" # Arrow Down
        @text = autocomplete
      when "\e[C" # Arrow Right
        @text = autocomplete
      when "\e[D" # Arrow Left
        @text = ""
      when "\177" # Backspace
        @text = @text.length > 0 ? @text[0,@text.length-1] : ""
        print "\b \b"
      when "\004" # Delete
        @text = ""
      when "\e[3~" # Delete Alias
        @text = ""
      when /^.$/
        @text += c.to_s
    end

    print c

  end

  def read_char

    STDIN.echo = false
    STDIN.raw!
    input = STDIN.getc.chr
    if input == "\e" then
      input << STDIN.read_nonblock(3) rescue nil
      input << STDIN.read_nonblock(2) rescue nil
    end
    ensure
      STDIN.echo = true
    return input

  end

end