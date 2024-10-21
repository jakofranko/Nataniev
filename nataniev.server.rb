#!/bin/env ruby
# encoding: utf-8

require 'sinatra'
require 'json'

require_relative "system/nataniev.rb"

set :port, (ARGV.first == "lobby" ? 8668 : 8888)

configure do
  set :bind, '0.0.0.0'
  enable :cross_origin
end

$nataniev = Nataniev.new

get '/' do

  headers( "Access-Control-Allow-Origin" => "*" )

  puts "================"
  puts "request.base_url: #{request.base_url}"
  puts "================"

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

  # TODO: handle favicon
  if params[:task].include? "favicon.ico" then return end

  headers( "Access-Control-Allow-Origin" => "*" )

  puts "================"
  puts "GET request.base_url: #{request.base_url}"
  puts "GET request params: #{params}"
  puts "================"

  v = ARGV.first ? ARGV.first : "ghost"
  if request.base_url.include? "xxiivv" then v = "landing" end
  if request.base_url.include? "wiki" then v = "oscean" end
  if request.base_url.include? "grimgrains" then v = "grimgrains" end
  if request.base_url.include? "100r" then v = "hundredrabbits" end
  if request.base_url.include? "paradise" then v = "paradise" end
  if request.base_url.include? "rotonde" then v = "rotonde" end
  if params[:task].include? ":maeve" then v = "maeve" end

  # Handle the `q` query parameter, if present
  unless params['q'].nil? then
    action_params = params['q']
  else
    action_params = params[:task]
  end

  $nataniev.answer("#{v} serve #{action_params}").to_s

end

post '/' do

  headers( "Access-Control-Allow-Origin" => "*" )

  puts "================"
  puts "POST request.base_url: #{request.base_url}"
  puts "POST request params: #{params}"
  puts "================"

  v = ARGV.first ? ARGV.first : "ghost"
  if request.base_url.include? "xxiivv" then v = "landing" end
  if request.base_url.include? "wiki" then v = "oscean" end
  if request.base_url.include? "grimgrains" then v = "grimgrains" end
  if request.base_url.include? "100r" then v = "hundredrabbits" end
  if request.base_url.include? "paradise" then v = "paradise" end
  if request.base_url.include? "rotonde" then v = "rotonde" end

  # Handle the `q` query parameter, if present
  unless params['q'].nil? then
    action_params = params['q']
  end

  a = $nataniev.answer("#{v} serve #{action_params}")
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
  Memory_Array.new("dict.russian", $nataniev.path).to_a.each do |word|
    if !h[word["ENGLISH"]] then h[word["ENGLISH"]] = {} end
    h[word["ENGLISH"]][:russian] = word["RUSSIAN"]
  end
  Memory_Array.new("dict.lietal", $nataniev.path).to_a.each do |word|
    if !h[word["ENGLISH"]] then h[word["ENGLISH"]] = {} end
    h[word["ENGLISH"]][:lietal] = word["LIETAL"]
  end
  Memory_Array.new("dict.traumae", $nataniev.path).to_a.each do |word|
    if !h[word["ENGLISH"]] then h[word["ENGLISH"]] = {} end
    h[word["ENGLISH"]][:traumae] = word["TRAUMAE"]
  end
  return h.to_json

end


post '/twitter.feed' do

  account = params["account"]

  require_relative "vessel/vessel.twitter.rb"
  return $nataniev.summon(:twitter).new.act(:feed,account)

end
