#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'twitter'

class Tweet

  include Vessel

  def via__see q = nil

    if q.to_s == "" then return "? Add a parameter to search for tweet." end

    text = "& Listing:\n"
    findTweets([q]).each do |tweet|
      text += "- #{tweet.user.screen_name.append(" ",25)} #{tweet.text.strip.gsub(/\r\n?/, "\n")}\n"
    end

    return text

  end

  def __look q = nil

    text = "Listing:\n"
    findTweets(["to:neauoire","aliceffekt","xxiivv"]).each do |tweet|
      text += "- #{tweet.user.screen_name.append(" ",25)} #{tweet.text.strip.gsub('\n','')}\n"
    end

    return text

  end

  def save account, content

    client(account).update(content)

    return "Saved tweet #{content}, to #{account}."

  end

  def findTweets words

    account = "neauoire"

    if !File.exist?("#{$nataniev.path}/secrets/secret.#{account}.config.rb") then return "Missing keys." end
    load "#{$nataniev.path}/secrets/secret.#{account}.config.rb"
    client = Twitter::REST::Client.new($twitter_config)

    tweets = []

    words.each do |word|
      client.search(word, :result_type => "recent").take(5).each do |tweet|
        tweets.push(tweet)
      end
    end

    return tweets

  end

  def last_tweets_at account

    tweets = []
    client(account).search("to:#{account}", :result_type => "recent").take(5).each do |tweet|
      tweets.push(tweet)
    end
    return tweets

  end

  def client account

    require "#{$nataniev.path}/secrets/secret.#{account}.config.rb"
    return Twitter::REST::Client.new($twitter_config)

  end

end