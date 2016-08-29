#!/bin/env ruby
# encoding: utf-8

require 'io/console'

class Console

  def start

    system("clear")
    @text = ""
    @last = ""

    puts "\n\n"
    print "Connection is active.\n\n> Vessel: "

  end

  def validate query = nil

    if !$nataniev.player
      $nataniev.set_player(query.split(" ").first)
      puts "\n\n"
      puts $nataniev.answer("connect").console_markup
      puts ""
    else
      $nataniev.refresh
      puts "\n\n"
      puts $nataniev.answer("#{query}").console_markup
      puts ""
    end

    @last = query.length > 1 ? query : @last
    @text = ""

    return "Done."

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
    when "\004" # Delete
      @text = ""
    when "\e[3~" # Delete Alias
      @text = ""
    when /^.$/
      @text += c.to_s
    end

    print("\e[1K\r")
    print " ".bg_red+" "+onion(@text)

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
      STDIN.cooked!
    return input

  end

  # Autocomplete

  def onion text

    if !$nataniev.player then return text end
    if !$nataniev.player.completion then return text end
      
    @onion = ""
    onionText = ""

    $nataniev.player.completion.each do |command|
      if text.length > 1 && command[0,text.length] == text
        @onion = "#{command}"
      end
    end

    onionText = "#{text}#{@onion[text.length,@onion.length-text.length].to_s.ghostly}"

    return onionText

  end

  def autocomplete

    return !@onion ? "" : @onion

  end

end

class String

  def colorize(color_code)
    "\e[#{color_code}m#{self}\e[0m"
  end

  def template
    i = 0
    while i < 50
      puts "#{i}".colorize(i)
      i += 1
    end
  end

  def bold ; colorize(1) end
  def ghostly ; colorize(2) ; end
  def underline ; colorize(4) end
  def blink ; colorize(5) end
  def bg ; colorize(7) end
  def black ; colorize(30) end
  def bg_red ; colorize(41) end
  def bg_grey ; colorize(47) end
  def bg_white ; colorize(7) end
  def red ; colorize(31) end
  def green ; colorize(32) end
  def yellow ; colorize(33) end
  def blue ; colorize(34) end
  def grey ; colorize(37) end
  def pink ; colorize(35) end
  def light_blue ; colorize(36) end

  def console_markup
    
    content = self

    if !content then return "" end
      
    search = content.scan(/(?:\{\{)([\w\W]*?)(?=\}\})/)
    search.each do |str,details|
        content = content.gsub("{{"+str+"}}",str.underline)
    end
    
    return "#{content}"

  end

end
