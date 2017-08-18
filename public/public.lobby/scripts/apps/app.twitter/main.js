function Twitter()
{
	App.call(this);

  this.name = "twitter";

  this.window.size = {width:420,height:420};
  this.window.pos = {x:30,y:30};

  this.methods.feed = {name:"feed",passive:true};
  this.methods.tweet = {name:"tweet",passive:true};
  this.methods.tweet_media = {name:"tweet_media",passive:true};

  this.IO.pos = {x:300,y:300}

  this.setup.start = function()
  {
  	this.app.feed();
  }

  this.feed = function()
  {
  	var app = this;
	  $.ajax({url: '/twitter.feed',
	    type: 'POST', 
	    data: { account: "neauoire" },
	    success: function(data) {
	      console.log(data);
	    }
	  })
  }

}

lobby.summon.confirm("Twitter");