#!/bin/env ruby
# encoding: utf-8

#!/bin/env ruby
# encoding: utf-8

$nataniev.require("corpse","http")

require 'rubygems'
require 'twitter'

class ActionFeed

  include Action

  def initialize q = nil

    super

    @name = "Feed"
    @docs = "Deliver the Oscean wiki."

  end

  def act q = nil

    account_name = q.split(" ").first
    feed_name = q.sub(account_name,"").strip

    return '[{"screen_name":"chasecolburn","text":"@neauoire @RekkaBell I hope to retire soon so that I can work more","timestamp":"1497919173"},{"screen_name":"ragekit","text":"@neauoire That cute","timestamp":"1497916470"},{"screen_name":"HughSJ","text":"@neauoire @realfakeAkira https://t.co/wd4wBnFiJD","timestamp":"1497910627"},{"screen_name":"groomblecom","text":"@neauoire @dictionarism Compound \'isms\' by adding prefixes or other words? postdictionarism, neodictionarism, human… https://t.co/QfiA9cm6WM","timestamp":"1497907504"},{"screen_name":"sonblaireau","text":"@neauoire I am extremely online it\'s true","timestamp":"1497904376"},{"screen_name":"CompositionFore","text":"@neauoire @dictionarism I\'d assume the romantic languages and analogues have an equivalent \'-ism\' suffix.","timestamp":"1497902612"},{"screen_name":"peterswimm","text":"@neauoire i dig vox fwiw, pretty winampian","timestamp":"1497893535"},{"screen_name":"ragekit","text":"@neauoire SSB for music files","timestamp":"1497893386"},{"screen_name":"ragekit","text":"@neauoire oh THOSE people","timestamp":"1497893345"},{"screen_name":"letkma","text":"@tha_rami @neauoire just a minimalist generative version of Binky\n\nhttps://t.co/anFw2E9hyv","timestamp":"1497891635"},{"screen_name":"realfakeAkira","text":"@neauoire Unbelievable! A cool dude like you still stuck to iTunes :D I have no suggestions unfortunately, the good… https://t.co/zXBMb6fFxO","timestamp":"1497889837"},{"screen_name":"starpause","text":"@neauoire But apparently some_Botty is till updating CCCatcher and distributing versions (was open source)? https://t.co/I5UEdQva4o","timestamp":"1497883952"},{"screen_name":"starpause","text":"@neauoire Had this same thought in 2011 and made CCCatcher, was cross platform and my daily player until flash desktop support died ☠","timestamp":"1497883882"},{"screen_name":"plstcp","text":"@neauoire @magpiesrobins @RekkaBell That south east Asia mentality of \'pleasure\' isn\'t known to the world of production. You must produce!!","timestamp":"1497882455"},{"screen_name":"onefifth","text":"@neauoire Sentiment analysis and cutting edge keyword blocking confirmed?","timestamp":"1497882261"},{"screen_name":"ragekit","text":"@neauoire Who\'s got music files anymore ?","timestamp":"1497878072"},{"screen_name":"maxdeviant","text":"@neauoire @dictionarism Fatalism.","timestamp":"1497874077"},{"screen_name":"kchplr","text":"@neauoire @dictionarism With a fine-tuned base dictionary I assume the result should be very convincing (and sometimes surprising)","timestamp":"1497856656"}]'

    require "#{$nataniev.path}/secret.twitter.#{account_name}.rb"
    
    client = Twitter::REST::Client.new($twitter_config)

    if feed_name == "mentions"
      target_feed = client.mentions_timeline
    else
      target_feed = client.home_timeline
    end

    feed = []

    target_feed.each do |tweet|
      feed.push({:screen_name => tweet.user.screen_name, :text => tweet.text, :timestamp => Time.parse(tweet.created_at.to_s).to_i.to_s})
    end
    
    return feed.to_json

  end

end

class ActionTweet

  include Action

  def initialize q = nil

    super

    @name = "Tweet"
    @docs = "Tweets"

  end

  def act q = ""

    account_name = q.split(" ").first
    tweet_content = q.sub(account_name,"").strip

    if account_name.to_s == "" then return {:error => "No account"} end
    if tweet_content.to_s == "" then return {:error => "No tweet content"} end

    require "#{$nataniev.path}/secret.twitter.#{account_name}.rb"

    client = Twitter::REST::Client.new($twitter_config)
    client.update(tweet_content)
    
    feed = []

    client.home_timeline.each do |tweet|
      feed.push({:screen_name => tweet.user.screen_name, :text => tweet.text, :timestamp => Time.parse(tweet.created_at.to_s).to_i.to_s})
    end
    
    return feed.to_json

  end

end

class VesselTwitter

  include Vessel

  def initialize id = 0

    super

    @name = "twitter"
    @path = File.expand_path(File.join(File.dirname(__FILE__), "/"))
    @docs = "The Nataniev lobby."

    install(:lobby,:feed)
    install(:lobby,:tweet)
    install(:generic,:document)
    install(:generic,:help)

  end

end