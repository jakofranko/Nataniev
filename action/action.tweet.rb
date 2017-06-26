#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'twitter'

class ActionTweet

  include Action

  attr_accessor :payload

  def initialize q = nil

    super

    @name = "Tweet"
    @docs = "[TODO]"
    @payload = nil

  end

  def act q = nil

    cached_payload = payload
    if !cached_payload then return "#{@host.name} has no payload." end
    if !account then return "#{@host.name} has no account." end
    if !File.exist?("#{$nataniev.path}/secret.twitter.#{account}.rb") then return "#{@host.name} has no config file." end

    load "#{$nataniev.path}/secret.twitter.#{account}.rb"

    client = Twitter::REST::Client.new($twitter_config)
    client.update(cached_payload)

    return "#{@host.name} tweeted \"#{cached_payload}\"."

  end

  #

  def tweet content
    
    tweet_client.update(content)

    return "#{@actor.twitter_account} tweeted: \"#{content}\""

  end

  def tweet_reply origin, content, follow = false

    client = tweet_client

    client.update(content, in_reply_to_status_id: origin.id)

    if follow == true then client.follow(origin.user.screen_name) end

  end

  def last_replies count = 5

    return tweet_client.search("to:#{@actor.twitter_account}", :result_type => "recent").take(count)

  end

end