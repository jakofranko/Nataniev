#!/bin/env ruby
# encoding: utf-8

$nataniev.require("corpse","http")

require 'json'

class ActionServe

  include Action
  
  def initialize q = nil

    super

    @name = "Serve"
    @docs = "Deliver the Nataniev lobby."

  end

  def act q = "Home"

    load_folder("#{@host.path}/objects/*")

    # Corpse
    
    corpse = CorpseHttp.new(@host,q)
    
    corpse.title = "Lobby | #{q}"
    
    return q[0,5] == "call:" ? query(q.sub("call:","")) : corpse.result

  end

  def query q

    q = q.gsub("+"," ")
    type = q.split(" ").first

    if !type.include?(".") then return {:error => "Misformatted query"}.to_json end

    app = type.split(".").first
    method = type.split(".").last
    params = q.sub("#{app}.#{method}","").strip

    load_folder("#{@host.path}/vessels/*")

    return Nataniev.new.answer("#{app} #{method} #{params}")

  end

  def json_answer query

    target = query.split(" ").first
    app = target.split(".").first
    met = target.split(".").last
    params = query.sub(target,"").strip

    if app == "oscean" then return oscean_api end
    if app == "paradise" then return paradise_api end
    if app == "player" then return player_api end
    if app == "twitter" then return twitter_api(met,params) end

    return {:error => nil}.to_json

  end

  def player_api

    a = []
    Dir["public/disk/player/*"].each do |path|
      artist = path.split("/").last
      Dir["public/disk/player/#{artist}/*"].each do |path|
        album = path.split("/").last
        Dir["public/disk/player/#{artist}/#{album}/*"].each do |path|
          track = path.split("/").last.split(".").first
          a.push({:artist => artist, :album => album, :name => track, :url => path.sub("public/","")})
        end
      end
    end
    return a.to_json

  end

  def twitter_api method, params

    if method == "tweet" then return twitter_api_tweet(params) end
    if method == "feed" then return twitter_api_feed(params) end
    if method == "follow" then return twitter_api_feed(params) end
    if method == "search" then return twitter_api_search(params) end

    # client.mentions_timeline

  end

  def twitter_api_tweet params = nil

    require_relative 'secret.twitter.neauoire.rb'
    client = Twitter::REST::Client.new($twitter_config)
    client.update(params)

    return {:error => nil}.to_json

  end

  def twitter_api_follow params = nil

    require_relative 'secret.twitter.neauoire.rb'
    client = Twitter::REST::Client.new($twitter_config)
    
    client.follow(params)

    return {:error => nil}.to_json

  end

  def twitter_api_search params = nil

    require_relative 'secret.twitter.neauoire.rb'
    client = Twitter::REST::Client.new($twitter_config)
    
    client.search(params, result_type: "recent").take(15).collect do |tweet|
      "#{tweet.user.screen_name}: #{tweet.text}"
    end

    return {:error => nil}.to_json

  end

  def twitter_api_feed params = nil

    return '[{"screen_name":"bitmOO","text":"@MllePilgrim THAT TREX I AM SCREAMING","timestamp":"1497731964"},{"screen_name":"nihilocrat","text":"RT @pishtaq: Procedural continent relief map at 0, 5 and 15 million years. #procgen https://t.co/qIXaaQ6hpS","timestamp":"1497731839"},{"screen_name":"Tekgo","text":"A romance has occurred #soundofmusic","timestamp":"1497731807"},{"screen_name":"tha_rami","text":"Not all innovation is a spectacular revolution. You innovate through iteration, until eventually an entirely new thing emerges.","timestamp":"1497731796"},{"screen_name":"idie_youdie","text":"This month\'s Patreon-supported bonus podcast is a commentary on Ministry\'s love-it-or-hate-it debut With Sympathy! \nhttps://t.co/ZU9MkDPzCJ","timestamp":"1497731724"},{"screen_name":"Tekgo","text":"Dancing with the captain? I never saw this coming! #soundofmusic","timestamp":"1497731692"},{"screen_name":"tha_rami","text":"I see innovations in AAA, commercial & non-commercial indie, emergent territories, mobile, hardware, business models, marketing, everywhere.","timestamp":"1497731638"},{"screen_name":"runefoams","text":"Who said yes? https://t.co/dO9mNnBELE","timestamp":"1497731611"},{"screen_name":"_tlr_","text":"RT @RogueInitiative: We\'re seeking an experienced interactive producer to work alongside AAA devs and filmmakers. https://t.co/IRtBkVnIyv…","timestamp":"1497731602"},{"screen_name":"_tlr_","text":"Attack On Titan continues to be so fucking good","timestamp":"1497731541"},{"screen_name":"Tekgo","text":"Time for a society gathering #soundofmusic","timestamp":"1497731511"},{"screen_name":"metanymie","text":"trying to convince ben to go to the vermont street fair to eat the worst fried food - we\'ve never tried funnel cakes before :o","timestamp":"1497731484"},{"screen_name":"siilime","text":"@neauoire Mmm, coffee. 👌 https://t.co/CBvcIcyyop","timestamp":"1497731429"},{"screen_name":"tha_rami","text":"Most if not every game I\'ve played so far this year has had at least something innovative and fascinating.","timestamp":"1497731414"},{"screen_name":"bitmOO","text":"It is still there right now, eating my lettuces and laughing at my expense with their slug friends.","timestamp":"1497731392"},{"screen_name":"Oniropolis","text":"RT @underagreysky: Ghosts on the Shore is Book of the Month for June on @tweetbytheriver - read an extract here #balticstories: https://t.c…","timestamp":"1497731370"},{"screen_name":"runefoams","text":"I use to feel more connected to them in the past?\nWhat did I do to myself? https://t.co/Tap8aBr6ZZ","timestamp":"1497731322"},{"screen_name":"plstcp","text":"@RekkaBell Something in the water!!!! (Purple potatoes are better)","timestamp":"1497731269"},{"screen_name":"tha_rami","text":"Someone asked if \"videogames lack originality\" & I realized I ran out of reasons to agree. There\'s so much happening in games nowadays.","timestamp":"1497731203"},{"screen_name":"bitmOO","text":"#HarvestMoo: Hello. Today a slug near our lettuces managed to run away from me. Somehow I was outrun by a slug.","timestamp":"1497731202"}]'

    require_relative 'secret.twitter.neauoire.rb'

    client = Twitter::REST::Client.new($twitter_config)

    feed = []

    client.home_timeline.each do |tweet|
      feed.push({:screen_name => tweet.user.screen_name, :text => tweet.text, :timestamp => Time.parse(tweet.created_at.to_s).to_i.to_s})
    end
    
    return feed.to_json

  end

end

class CorpseHttp
  
  attr_accessor :events

  def build

    add_meta("description","A design studio on a sailboat")
    add_meta("keywords","sailing, patreon, indie games, design, liveaboard")
    add_meta("viewport","width=device-width, initial-scale=1, maximum-scale=1")
    add_meta("apple-mobile-web-app-capable","yes")

    add_link("reset.css",:lobby)
    add_link("font.input_mono.css",:lobby)
    add_link("main.css",:lobby) 

    add_script("core/jquery.js")
    add_script("core/lobby.js")
    add_script("core/commander.js")
    add_script("core/keyboard.js")
    add_script("core/app.js")

  end
  
  def body

    html = "
    <script>
      var lobby = new Lobby();
      lobby.init();
    </script>"
    
    return html
    
  end

end