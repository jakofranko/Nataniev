#!/bin/env ruby
# encoding: utf-8

require 'io/console'

load "#{$paradise_path}/system/parade.rb"

class Console

  def initialize

    system("clear")
    @text = ""
    @last = ""
    @user = nil
    $parade = nil

    puts "\n\n"
    print "> "

  end

  def validate query = nil

    if !@user
      @user = query
      $parade = Parade.new(@user)
      puts "\n\n"
      puts $parade.act("connect")
      puts ""
    else
      puts "\n\n"
      puts $parade.act(query)
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

    if !@user then return text end
    onion = ""
    onionText = ""

    $parade.completion.each do |command,params|
      if text.length > 1 && command[0,text.length] == text
        onion = params != "" ? "#{command} (#{params})" : "#{command}"
      end
    end

    onionText = "#{text}#{onion[text.length,onion.length-text.length].to_s.ghostly}"

    return onionText

  end

  def autocomplete

    $parade.completion.each do |command,params|
      if @text.length > 1 && command[0,@text.length] == @text
        return command
      end
    end

  end

end