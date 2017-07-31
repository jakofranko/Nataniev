function Twitter()
{
	App.call(this);

	this.name = "twitter";
	this.size = {width:300,height:480};
	this.origin = {x:0,y:0};
	this.filter = {highlight:[],mute:[]}
	this.filter.highlight.push("neauoire");

	this.methods.feed = {name:"feed"};
	this.methods.mentions = {name:"mentions"};
	this.methods.tweet = {name:"tweet",param:"message"};
	this.methods.reply = {name:"reply",param:"tweet_id user_names message"};
	this.methods.retweet = {name:"retweet",param:"tweet_id"};
	this.methods.profile = {name:"profile",param:"user_name"};

	this.methods.mute = {name:"mute",param:"word"};
	this.methods.highlight = {name:"highlight",param:"word"};
	this.methods.refresh = {name:"refresh"};

	this.last_pull = null;

	this.includes = ["tweet"];

	this.on_launch = function()
	{
		this.wrapper_el.innerHTML = "Loading feed..";
		this.call("feed","neauoire");
		this.ghost();
	}

	this.call_back = function(m,r)
	{
		this.update_feed(r);
	}

	this.update_feed = function(tweets)
	{
		this.wrapper_el.innerHTML = "";

		var html = "";

		for(id in tweets){
			var tweet = new Tweet(tweets[id]);
			this.wrapper_el.appendChild(tweet.el);
		}
		this.last_pull = tweets;
		setTimeout(function(){ lobby.apps.twitter.refresh(); }, 30000);
	}

	this.feed = function()
	{
		this.call("feed","neauoire");
	}

	this.mentions = function()
	{
		this.call("feed","neauoire mentions");
	}

	this.tweet = function(value)
	{
		this.call("tweet","neauoire "+value);
	}

	this.reply = function(value)
	{
		this.call("reply","neauoire "+value);
	}

	this.reply = function(value)
	{
		this.call("retweet","neauoire "+value);
	}

	this.highlight = function(value)
	{
		this.filter.highlight.push(value);
		this.update_feed(this.last_pull);
	}

	this.mute = function(value)
	{
		this.filter.mute.push(value);
		this.update_feed(this.last_pull);
	}

	this.refresh = function()
	{
		this.call("feed","neauoire");
	}
}

lobby.summon.confirm("Twitter");