#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'twitter'

module ActionTweet # TODO

  include Action

  def tweet content
    
    tweet_client.update(content)

    return "#{@actor.twitter_account} tweeted: #{content}"

  end

  def tweet_reply origin, content, follow = false

    client = tweet_client

    client.update(content, in_reply_to_status_id: origin.id)

    if follow == true then client.follow(origin.user.screen_name) end

  end

  def tweet_client

    require "#{$nataniev.path}/secrets/secret.#{@actor.twitter_account}.config.rb"
    return Twitter::REST::Client.new($twitter_config)

  end

  def last_replies count = 5

    return tweet_client.search("to:#{@actor.twitter_account}", :result_type => "recent").take(count)

  end

end