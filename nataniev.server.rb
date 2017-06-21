#!/bin/env ruby
# encoding: utf-8

require 'sinatra'
require 'sinatra/cross_origin'

require_relative "system/nataniev.rb"

configure do
  enable :cross_origin
end

set :port, 8888

set :allow_origin, :any
set :allow_methods, [:get, :post, :options]
set :allow_credentials, true
set :max_age, "1728000"
set :expose_headers, ['Content-Type']

options "*" do
  response.headers["Allow"] = "HEAD,GET,PUT,POST,DELETE,OPTIONS"
  response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept"
  200
end

get '/' do
  cross_origin
  
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
