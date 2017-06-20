#!/bin/env ruby
# encoding: utf-8

require 'sinatra'

require_relative "system/nataniev.rb"

set :port, 8888

get '/' do
  $nataniev = Nataniev.new
  
  v = ARGV.first ? ARGV.first : "ghost"

  if request.base_url.include? "xxiivv" then v = "landing"
  elsif request.base_url.include? "wiki" then v = "oscean"
  elsif request.base_url.include? "grimgrains" then v = "grimgrains"
  elsif request.base_url.include? "100r" then v = "hundredrabbits"
  elsif request.base_url.include? "paradise" then v = "paradise"
  elsif request.base_url.include? "lobby" then v = "paradise"
  end

  a = $nataniev.answer("#{v} serve home")
  "#{a}"
end


get '/:task' do
  $nataniev = Nataniev.new
  
  v = ARGV.first ? ARGV.first : "ghost"
  if request.base_url.include? "xxiivv" then v = "landing"
  elsif request.base_url.include? "wiki" then v = "oscean"
  elsif request.base_url.include? "grimgrains" then v = "grimgrains"
  elsif request.base_url.include? "100r" then v = "hundredrabbits"
  elsif request.base_url.include? "paradise" then v = "paradise"
  end
  
  a = $nataniev.answer("#{v} serve "+params[:task])
  "#{a}"
end
