#!/bin/env ruby
# encoding: utf-8

require 'io/console'

class Console

  def start q = nil

    $nataniev.require("corpse","console")

    system("clear")
    @text = ""
    @last = ""
    @id   = q

    puts "\n"
    print " "+" + ".bg_white+" #{q} Connected.\n"+" "+" > ".bg_white+" "

  end

  def validate query = nil

    parts  = query.split(" ")
    actor  = @id ? @id : 51
    action = parts[0] ? parts[0] : "look"
    params = query.sub("#{actor}","").sub("#{action}","").strip

    puts "\n "+" - ".bg_white+" ------------------------------------------------------\n"
    puts $nataniev.operate(actor,action,params).console_markup

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
    when "\004" # Delete
      @text = ""
    when "\e[3~" # Delete Alias
      @text = ""
    when /^.$/
      @text += c.to_s
    end

    print("\e[1K\r")
    print " "+" > ".bg_white+" "+onion(@text)

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

    if !$nataniev.actor then return text end
      
    @onion = ""
    onionText = ""

    $nataniev.actor.all_actions.each do |command|
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