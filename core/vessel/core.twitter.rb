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

    # return '[{"id":"878019880733114368","user_name":"UnburntWitch","user_id":226346115,"text":"Wow I guess rape has just been legal in North Carolina for longer than I\'ve been alive, huh. https://t.co/OdkQZvoAni","retweet_count":10,"timestamp":"1498171227"},{"id":878019805776891905,"user_name":"wazzra","user_id":16938512,"text":"So that\'s a start! #summerlovin #summerdrinkin @ La Brasserie Saint-Denis https://t.co/4zAwTzFTIV","retweet_count":0,"timestamp":"1498171209"},{"id":878019768782946305,"user_name":"littleautomaton","user_id":29180628,"text":"RT @markurage: https://t.co/j9PDIq6mjQ","retweet_count":894,"timestamp":"1498171200"},{"id":878019289558597632,"user_name":"jukiokallio","user_id":10314262,"text":"@zerstoerer elder scrolls 9: skyrim","retweet_count":0,"timestamp":"1498171086"},{"id":878019229894582272,"user_name":"makoConstruct","user_id":858751554,"text":"Be aware of how far ahead you can see. Aspire to augury during design, but never convince yourself that you really know how things will test","retweet_count":0,"timestamp":"1498171071"},{"id":878019068976123904,"user_name":"SilverSober","user_id":91670694,"text":"RT @TumbleSeedGame: The TumbleSeed 4 Peaks Update is now live on Steam! We have a lot of changes, and a postmortem to back them up: https:/…","retweet_count":81,"timestamp":"1498171033"},{"id":878019040492494853,"user_name":"levelsio","user_id":1577241403,"text":"RT @abustamante: @levelsio @Airbnb Agree with all of those. Have suffered the fake photos stuff myself in LA twice, and noise nuisance from…","retweet_count":1,"timestamp":"1498171026"},{"id":878018960037265410,"user_name":"SilverSober","user_id":91670694,"text":"hashtag no filter https://t.co/DMhydHabtC https://t.co/illDKfZCXH","retweet_count":0,"timestamp":"1498171007"},{"id":878018902479056898,"user_name":"jeansnow","user_id":16125731,"text":"RT @warrenellis: BruceS — marxferatu: unsettlingstories: h3c70r: ... https://t.co/qx1Sa4VaWK https://t.co/wmgKRZBR13","retweet_count":43,"timestamp":"1498170993"},{"id":878018757448278016,"user_name":"arnaud_debock","user_id":57318109,"text":"RT @devolverdigital: The Steam Summer Sale is heating up and the Devolver Digital games you shamefully don’t own are up to 90% off! https:/…","retweet_count":109,"timestamp":"1498170959"},{"id":878018362617380864,"user_name":"sougwen","user_id":7670482,"text":"RT @OpenTranscripts: To launch its Ethics & Governance of Artificial Intelligence project, @BKCHarvard produced a series of short interview…","retweet_count":6,"timestamp":"1498170865"},{"id":878018349204197377,"user_name":"zerstoerer","user_id":37712201,"text":"@jukiokallio yes i am and i can’t wait for you to see the elder scrolls 9: what’s that bird","retweet_count":0,"timestamp":"1498170861"},{"id":878018260788142081,"user_name":"_tlr_","user_id":52543758,"text":"RT @samrolfes: 🇺🇸➕ https://t.co/8xBg7djIkN","retweet_count":1,"timestamp":"1498170840"},{"id":878018085097177088,"user_name":"YlemXyz","user_id":585466310,"text":"RT @polNewsForever: The Democrat Party has torn itself apart, and most of America is sick and tired of them.\n\n2016 was the beginning of the…","retweet_count":446,"timestamp":"1498170798"},{"id":878017945393401857,"user_name":"jukiokallio","user_id":10314262,"text":"@zerstoerer are u todd howard https://t.co/Sg3YH0A3w7","retweet_count":0,"timestamp":"1498170765"},{"id":878017615716810752,"user_name":"zerstoerer","user_id":37712201,"text":"i have downloaded myself into the grid https://t.co/TzzNQ77jHY","retweet_count":0,"timestamp":"1498170687"},{"id":878017482769874944,"user_name":"beardswin","user_id":22558386,"text":"RT @spacetwinks: Diaries Of A Spaceport Janitor ($2.49) https://t.co/PK1qNojp8c https://t.co/Tw5Xreut4N","retweet_count":7,"timestamp":"1498170655"},{"id":878017176837382144,"user_name":"notquitefrodo","user_id":713390006,"text":"Now that they banned dupes from beig in gyms ALL POKEMON ARE VIABLE\n\nGET 👏🏻 IN 👏🏻 ON 👏🏻 THIS","retweet_count":0,"timestamp":"1498170582"},{"id":878017100605906944,"user_name":"JoanieLemercier","user_id":238848438,"text":"https://t.co/nzKov1V4ak","retweet_count":2,"timestamp":"1498170564"},{"id":878016714385932288,"user_name":"sovietsoreyuke","user_id":824189261452808192,"text":"RT @nishikazucrafts: ブランは軌道離脱用のレトロモーターしか持っていないから機体が軽くなり比較的安全に帰還できる。 https://t.co/AOuWXRbptx","retweet_count":2,"timestamp":"1498170472"}]'

    require "#{$nataniev.path}/secret.twitter.#{account_name}.rb"
    
    client = Twitter::REST::Client.new($twitter_config)

    if feed_name == "mentions"
      target_feed = client.mentions_timeline
    else
      target_feed = client.home_timeline
    end

    feed = []

    target_feed.each do |tweet|
      feed.push({:id => tweet.id.to_s, :user_name => tweet.user.screen_name, :user_id => tweet.user.id, :text => tweet.text, :retweet_count => tweet.retweet_count, :timestamp => Time.parse(tweet.created_at.to_s).to_i.to_s})
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
    if tweet_content.to_s == "" then return {:error => "No content"} end

    require "#{$nataniev.path}/secret.twitter.#{account_name}.rb"

    client = Twitter::REST::Client.new($twitter_config)
    client.update(tweet_content)
    
    return {:util => "Success"}.to_json

  end

end

class ActionReply

  include Action

  def initialize q = nil

    super

    @name = "Reply"
    @docs = "Replies"

  end

  def act q = ""

    parts = q.split(" ")
    account_name  = parts.first
    tweet_id      = parts[1].to_i
    tweet_content = parts[2,parts.length].join(" ").strip

    if account_name.to_s == "" then return {:error => "No account"} end
    if tweet_content.to_s == "" then return {:error => "No content"} end
    if tweet_id < 1 then return {:error => "No id"} end

    require "#{$nataniev.path}/secret.twitter.#{account_name}.rb"

    client = Twitter::REST::Client.new($twitter_config)
    @client.update("@#{tweet_content}", in_reply_to_status_id: tweet_id)
    
    return {:util => "Success"}.to_json

  end

end
class ActionRetweet

  include Action

  def initialize q = nil

    super

    @name = "Retweet"
    @docs = "Retweets"

  end

  def act q = ""

    account_name = q.split(" ").first
    tweet_id = q.sub(account_name,"").strip

    if account_name.to_s == "" then return {:error => "No account"} end
    if tweet_id.to_i < 1 then return {:error => "No id"} end

    client = Twitter::REST::Client.new($twitter_config)
    target_tweet = client.status(tweet_id.to_i)

    # client.retweet(target_tweet)

    return target_tweet.text
    require "#{$nataniev.path}/secret.twitter.#{account_name}.rb"

    client = Twitter::REST::Client.new($twitter_config)
    client.update(tweet_content)
    
    return {:util => "Success"}.to_json

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
    install(:lobby,:reply)
    install(:lobby,:retweet)
    install(:generic,:document)
    install(:generic,:help)

  end

end