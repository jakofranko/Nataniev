#!/bin/env ruby
# encoding: utf-8

require 'sinatra'

require_relative "system/nataniev.rb"

set :port, 8888

get '/:task' do
  $nataniev = Nataniev.new
  puts request.base_url
  "#{$nataniev.answer("#{ARGV.first} serve "+params[:task])}"
end
