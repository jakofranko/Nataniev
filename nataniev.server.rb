#!/bin/env ruby
# encoding: utf-8

require 'sinatra'

require_relative "system/nataniev.rb"

get '/:task' do
  $nataniev = Nataniev.new
  "#{$nataniev.answer("#{ARGV.first} serve "+params[:task])}"
end