#!/bin/env ruby
# encoding: utf-8

require 'sinatra'
require 'json'

require_relative "system/nataniev.rb"

set :port, (ARGV.first == "lobby" ? 8668 : 8888)

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
  if request.base_url.include? ":maeve" then v = "maeve" end
  a = $nataniev.answer("#{v} serve home")
  "#{a}"
  
end

get '/:task' do

  headers( "Access-Control-Allow-Origin" => "*" )
  $nataniev = Nataniev.new

  v = ARGV.first ? ARGV.first : "ghost"
  if request.base_url.include? "xxiivv" then v = "landing" end
  if request.base_url.include? "wiki" then v = "oscean" end
  if request.base_url.include? "grimgrains" then v = "grimgrains" end
  if request.base_url.include? "100r" then v = "hundredrabbits" end
  if request.base_url.include? "paradise" then v = "paradise" end
  if request.base_url.include? "rotonde" then v = "rotonde" end
  if params[:task].include? ":maeve" then v = "maeve" end
  a = $nataniev.answer("#{v} serve "+params[:task])
  "#{a}"
  
end

post '/ide.save' do

  path = params["file_path"]
  code = params["file_content"]

  # Create temp file
  out_file = File.new("#{path}.tmp", "w")
  out_file.puts(code)
  out_file.close

  # Replace file
  File.rename("#{path}.tmp", path)

end

post '/ide.load' do

  path = params["file_path"]

  "#{File.read(path, :encoding => 'UTF-8')}"

end

post '/ide.tree' do

  a = []

  Dir['**/*'].each do |file|
    ext = file.split(".").last
    # if !["ma","mh","rb","js","css","html"].include?(ext) then next end
    a.push(file)
  end
  
  return a.to_json

end

post '/diary.load' do

  date = params["date"]

  h = {}
  h[:oscean] = $nataniev.summon(:oscean).new.act(:query,"diary")
  h[:grimgrains] = $nataniev.summon(:grimgrains).new.act(:query,"diary")
  
  return h.to_json

end

post '/dict.load' do

  h = {}
  Memory_Array.new("dict.russian",Nataniev.new.path).to_a.each do |word|
    if !h[word["ENGLISH"]] then h[word["ENGLISH"]] = {} end
    h[word["ENGLISH"]][:russian] = word["RUSSIAN"]
  end
  Memory_Array.new("dict.lietal",Nataniev.new.path).to_a.each do |word|
    if !h[word["ENGLISH"]] then h[word["ENGLISH"]] = {} end
    h[word["ENGLISH"]][:lietal] = word["LIETAL"]
  end  
  return h.to_json

end