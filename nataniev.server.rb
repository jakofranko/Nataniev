#!/bin/env ruby
require 'sinatra'
require 'json'

require_relative 'system/nataniev'

set :port, (ARGV.first == 'lobby' ? 8668 : 8888)

configure do

  set :bind, '0.0.0.0'
  enable :cross_origin

end

enable :sessions

$nataniev = Nataniev.new

get '/' do

  headers('Access-Control-Allow-Origin' => '*')

  puts '================'
  puts "request.base_url: #{request.base_url}"
  puts '================'

  puts 'Session ================'
  puts session.inspect
  puts '================'

  v = ARGV.first || 'ghost'
  v = 'landing' if request.base_url.include? 'xxiivv'
  v = 'oscean' if request.base_url.include? 'wiki'
  v = 'grimgrains' if request.base_url.include? 'grimgrains'
  v = 'hundredrabbits' if request.base_url.include? '100r'
  v = 'paradise' if request.base_url.include? 'paradise'
  v = 'rotonde' if request.base_url.include? 'rotonde'
  v = 'maeve' if request.base_url.include? ':maeve'
  a = $nataniev.answer("#{v} serve home")
  "#{a}"

end

get '/:task' do

  # TODO: handle favicon
  return if params[:task].include? 'favicon.ico'

  puts 'Session ================'
  puts session.inspect
  puts '================'

  headers('Access-Control-Allow-Origin' => '*')

  puts '================'
  puts "GET request.base_url: #{request.base_url}"
  puts "GET request params: #{params}"
  puts '================'

  v = ARGV.first || 'ghost'
  v = 'landing' if request.base_url.include? 'xxiivv'
  v = 'oscean' if request.base_url.include? 'wiki'
  v = 'grimgrains' if request.base_url.include? 'grimgrains'
  v = 'hundredrabbits' if request.base_url.include? '100r'
  v = 'paradise' if request.base_url.include? 'paradise'
  v = 'rotonde' if request.base_url.include? 'rotonde'
  v = 'maeve' if params[:task].include? ':maeve'

  # Handle the `q` query parameter, if present
  action_params = if params['q'].nil?
                    params[:task]
                  else
                    params['q']
                  end

  $nataniev.answer("#{v} serve #{action_params}").to_s

end

post '/' do

  headers('Access-Control-Allow-Origin' => '*')

  puts '================'
  puts "POST request.base_url: #{request.base_url}"
  puts "POST request params: #{params}"
  puts '================'

  v = ARGV.first || 'ghost'
  v = 'landing' if request.base_url.include? 'xxiivv'
  v = 'oscean' if request.base_url.include? 'wiki'
  v = 'grimgrains' if request.base_url.include? 'grimgrains'
  v = 'hundredrabbits' if request.base_url.include? '100r'
  v = 'paradise' if request.base_url.include? 'paradise'
  v = 'rotonde' if request.base_url.include? 'rotonde'

  # Handle the `q` query parameter, if present
  action_params = params['q'] unless params['q'].nil?

  $nataniev.answer("#{v} serve #{action_params}").to_s

end

post '/ide.save' do

  path = params['file_path']
  code = params['file_content']

  # Create temp file
  out_file = File.new("#{path}.tmp", 'w')
  out_file.puts(code)
  out_file.close

  # Replace file
  File.rename("#{path}.tmp", path)

end

post '/ide.load' do

  path = params['file_path']

  File.read(path, encoding: 'UTF-8').to_s

end

post '/ide.tree' do

  a = []

  Dir['**/*'].each do |file|

    # ext = file.split('.').last
    # if !["ma","mh","rb","js","css","html"].include?(ext) then next end
    a.push(file)

  end

  return a.to_json

end

post '/diary.load' do

  # date = params['date']

  h = {}
  h[:oscean] = $nataniev.summon(:oscean).new.act(:query, 'diary')
  h[:grimgrains] = $nataniev.summon(:grimgrains).new.act(:query, 'diary')

  return h.to_json

end

post '/dict.load' do

  h = {}
  Memory_Array.new('dict.russian', $nataniev.path).to_a.each do |word|

    h[word['ENGLISH']] = {} unless h[word['ENGLISH']]
    h[word['ENGLISH']][:russian] = word['RUSSIAN']

  end
  Memory_Array.new('dict.lietal', $nataniev.path).to_a.each do |word|

    h[word['ENGLISH']] = {} unless h[word['ENGLISH']]
    h[word['ENGLISH']][:lietal] = word['LIETAL']

  end
  Memory_Array.new('dict.traumae', $nataniev.path).to_a.each do |word|

    h[word['ENGLISH']] = {} unless h[word['ENGLISH']]
    h[word['ENGLISH']][:traumae] = word['TRAUMAE']

  end

  h.to_json

end

post '/twitter.feed' do

  account = params['account']

  require_relative 'vessel/vessel.twitter'

  $nataniev.summon(:twitter).new.act(:feed, account)

end
