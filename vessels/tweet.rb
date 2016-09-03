#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'twitter'

class Tweet

	include Vessel

	def __look q = nil

		account = "neauoire"

		if !File.exist?("#{$nataniev_path}/secrets/secret.#{account}.config.rb") then return "Missing keys." end

		load "#{$nataniev_path}/secrets/secret.#{account}.config.rb"

		client = Twitter::REST::Client.new($twitter_config)
		client.search("to:#{account}", :result_type => "recent").take(15).each do |tweet|
			puts "#{tweet.user.screen_name.append(" ",25)} #{tweet.text.sub("@"+account,"").strip}"
		end

		return "Completed."

	end

	def save account, content

		if !File.exist?("#{$nataniev_path}/secrets/secret.#{account}.config.rb") then return "Missing keys." end

		load "#{$nataniev_path}/secrets/secret.#{account}.config.rb"

		client = Twitter::REST::Client.new($twitter_config)
		client.update(content)

		return "Saved tweet #{content}, to #{account}."

	end

end