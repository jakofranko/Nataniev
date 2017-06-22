#!/bin/env ruby
# encoding: utf-8

require 'sinatra'

require_relative "system/nataniev.rb"

set :port, 8888

configure do
  enable :cross_origin
end

get '/' do

  headers( "Access-Control-Allow-Origin" => "*" )
  $nataniev = Nataniev.new
  
  v = ARGV.first ? ARGV.first : "ghost"
  if request.base_url.include? "xxiivv" then v = "landing" end
  if request.base_url.include? "wiki" then v = "oscean" end
  if request.base_url.include? "grimgrains" then v = "grimgrains" end
  if request.base_url.include? "100r" then v = "hundredrabbits" end
  if request.base_url.include? "paradise" then v = "paradise" end
  if request.base_url.include? "rotonde" then v = "rotonde" end
  a = $nataniev.answer("#{v} serve home")
  "#{a}"
end


get '/:task' do
  $nataniev = Nataniev.new
  
  v = ARGV.first ? ARGV.first : "ghost"
  if request.base_url.include? "xxiivv" then v = "landing" end
  if request.base_url.include? "wiki" then v = "oscean" end
  if request.base_url.include? "grimgrains" then v = "grimgrains" end
  if request.base_url.include? "100r" then v = "hundredrabbits" end
  if request.base_url.include? "paradise" then v = "paradise" end
  if request.base_url.include? "rotonde" then v = "rotonde" end
  a = $nataniev.answer("#{v} serve "+params[:task])
  "#{a}"
end
