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

    return '[{"id":877782054502400000,"user_name":"etterstudio","user_id":147953720,"text":"https://t.co/CGzFWDH3Ls","timestamp":"1498114524"},{"id":877782037381251072,"user_name":"vaporstack","user_id":2690465202,"text":"@osavox pretty sure they\'re people, they exhibit agency, just don\'t know how they found me","timestamp":"1498114520"},{"id":877781981383106560,"user_name":"SilverSober","user_id":91670694,"text":"And now the weak, warm Lisa exposes her warm blood to hungry mosquitos","timestamp":"1498114507"},{"id":877781442918465536,"user_name":"osavox","user_id":3453825554,"text":"@vaporstack Unpeople","timestamp":"1498114379"},{"id":877781037153083394,"user_name":"sovietsoreyuke","user_id":824189261452808192,"text":"RT @MASANOR21217100: 今日は久しぶりに油彩で人物描いたが難しい。 https://t.co/f1ZmfRCK4X","timestamp":"1498114282"},{"id":877780959101304832,"user_name":"sovietsoreyuke","user_id":824189261452808192,"text":"1941年6月22日ドイツ軍がソ連に侵入。緒戦の負け続けアート。\n#ソ連\n#独ソ戦 https://t.co/KmMTvsL0hX","timestamp":"1498114263"},{"id":877780551163236352,"user_name":"SilverSober","user_id":91670694,"text":"OK but a I\'ve found a mosquitos in my hair and it bit me on my head and now my head is itchy wtf Canada","timestamp":"1498114166"},{"id":877780541478756354,"user_name":"electricgecko","user_id":11177292,"text":"@neauoire got a rotonde feed going → https://t.co/OEWzLEounM","timestamp":"1498114164"},{"id":877780317859336192,"user_name":"Kuvshinov_Ilya","user_id":152731266,"text":"RT @donguri_suzume0: 40/100 https://t.co/QsSUBi79zn","timestamp":"1498114110"},{"id":877780052909240320,"user_name":"runefoams","user_id":2465122428,"text":"RT @SilverChangling: Giving queer women platforms is good","timestamp":"1498114047"},{"id":877779997959757824,"user_name":"Kuvshinov_Ilya","user_id":152731266,"text":"RT @Poisoner_Batta: サブカルクソ狸女さんチーム🙄 https://t.co/JpkvxRR2T2","timestamp":"1498114034"},{"id":877779983896199168,"user_name":"Kuvshinov_Ilya","user_id":152731266,"text":"RT @38_colis: 初夏の清霜 https://t.co/KCnDCUmtVE","timestamp":"1498114031"},{"id":877779883182706688,"user_name":"direlog","user_id":423369223,"text":"every night the same dream… “come to Silent Hill, we’re having a FOG PARTY. don’t forget your PSYCHOSEXUAL MONSTER COSTUME”","timestamp":"1498114007"},{"id":877778764691681281,"user_name":"yuriyr","user_id":45027998,"text":"RT @shanebjohnston: Ninja my new favorite. https://t.co/o55XZCLR5c","timestamp":"1498113740"},{"id":877778670672388096,"user_name":"vaporstack","user_id":2690465202,"text":"who are these people following me on instagram","timestamp":"1498113718"},{"id":877778609359933440,"user_name":"Kuvshinov_Ilya","user_id":152731266,"text":"RT @conradroset: CLAIRE https://t.co/NHBhHx6kI1","timestamp":"1498113703"},{"id":877778460722159616,"user_name":"Kuvshinov_Ilya","user_id":152731266,"text":"RT @nerikeshikun009: らくがき。 https://t.co/IEM96tHpWO","timestamp":"1498113668"},{"id":877778442997047296,"user_name":"futurechase","user_id":14187924,"text":"i’m listening to the most angsty music from 2002-2003 and i’m not going to apologize for it","timestamp":"1498113663"},{"id":877778410545627137,"user_name":"Kuvshinov_Ilya","user_id":152731266,"text":"RT @juunigou: お天気雨大好き学級委員長 https://t.co/RkNQSTOMFG","timestamp":"1498113656"},{"id":877778308544548864,"user_name":"SilverSober","user_id":91670694,"text":"whaddup fam https://t.co/ucThCYLQVP https://t.co/tG8GtRT1Lf","timestamp":"1498113631"}]'

    require "#{$nataniev.path}/secret.twitter.#{account_name}.rb"
    
    client = Twitter::REST::Client.new($twitter_config)

    if feed_name == "mentions"
      target_feed = client.mentions_timeline
    else
      target_feed = client.home_timeline
    end

    feed = []

    target_feed.each do |tweet|
      feed.push({:id => tweet.id, :user_name => tweet.user.screen_name, :user_id => tweet.user.id, :text => tweet.text, :timestamp => Time.parse(tweet.created_at.to_s).to_i.to_s})
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
    
    return {:util => "Success"}

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

    return "(#{account_name}) #{tweet_id} -> #{tweet_content}"

    if account_name.to_s == "" then return {:error => "No account"} end
    if tweet_content.to_s == "" then return {:error => "No content"} end
    if tweet_id < 1 then return {:error => "No id"} end

    require "#{$nataniev.path}/secret.twitter.#{account_name}.rb"

    client = Twitter::REST::Client.new($twitter_config)
    client.update(tweet_content)
    
    return {:util => "Success"}

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
    install(:generic,:document)
    install(:generic,:help)

  end

end