function App_Player()
{
	App.call(this);

	this.name = "player";
	this.size = {width:0,height:30};
	this.origin = {x:0,y:-30};
  this.methods.play = {name:"play",param:"param"};
  this.methods.stop = {name:"stop"};
  this.methods.list = {name:"list"};
  this.methods.go = {name:"go"};

  this.audio = new Audio();
  this.catalog = {};
  this.directory = null;
  this.playlist = null;

  this.search_el = document.createElement("t"); this.search_el.className = "search";
  this.artist_el = document.createElement("t"); this.artist_el.className = "artist";

  this.track_el = document.createElement("t"); this.track_el.className = "track";
  this.album_el = document.createElement("t"); this.album_el.className = "album";
  this.time_el = document.createElement("t"); this.time_el.className = "time";
  this.list_el = document.createElement("list");

	this.start = function()
	{
    this.el.style.width = this.size.width+"px";
    this.el.style.height = this.size.height+"px";
    this.el.style.top = this.origin.y+"px"; 
    this.el.style.left = this.origin.x+"px";
        
    this.wrapper_el.appendChild(this.search_el);
    this.wrapper_el.appendChild(this.artist_el);
    this.wrapper_el.appendChild(this.time_el);
    this.wrapper_el.appendChild(this.track_el);
    this.wrapper_el.appendChild(this.album_el);
    this.wrapper_el.appendChild(this.list_el);

    lobby.el.appendChild(this.el);

    $(this.el).animate({ height: 30+"px",width: 300+"px" }, 100);
    this.search_el.innerHTML = "";
    this.ghost();

    this.query_tracks(); 
	}

  this.index = 0;

  this.play = function(search)
  {
    this.make_playlist(search);
    var track = this.playlist[this.index];

    this.search_el.innerHTML = search+" "+(this.index+1)+"/"+this.playlist.length+" > ";
    this.artist_el.innerHTML = track.artist+" ";
    this.track_el.innerHTML = " - "+track.name+" ";
    this.album_el.innerHTML = "("+track.album+")";

    this.play_candidate(track);
    $(this.el).animate({ top:-30+"px", left:-30+"px",height: 30+"px",width: 210+"px" }, 100);
  }

  this.stop = function()
  {
    $(this.audio).animate({volume: 0}, 500, function(){
      lobby.apps.app_player.audio.pause();
    });
  }

  this.go = function(time)
  {
  }

  this.list = function(val)
  {
    this.show();

    var html = "";
    var artists = {};
    for(track_id in this.directory){
      var track = this.directory[track_id];
      if(!artists[track.artist]){ artists[track.artist] = []; }
      artists[track.artist].push(track);
    }

    for(artist in artists){
      html += "<ln>"+artist+" <span>"+artists[artist].length+"</span></ln>"
    }

    this.search_el.innerHTML = "player.list";
    this.list_el.innerHTML = html+"<hr/>";

    $(this.el).animate({ top:-30+"px", left:-30+"px",height: 390+"px",width: 630+"px" }, 100);
  }

  this.make_playlist = function(search)
  {
    this.index = 0;
    var a = [];

    for(track_id in this.directory){
      var track = this.directory[track_id];
      if(track.name.toLowerCase().indexOf(search) > -1){ a.push(track); continue; }
      if(track.artist.toLowerCase().indexOf(search) > -1){ a.push(track); continue; }
      if(track.album.toLowerCase().indexOf(search) > -1){ a.push(track); continue; }
    }

    this.playlist = a;
  }

  this.play_candidate = function(candidate)
  {
    console.log("Playing",candidate);

    // Fadeout
    $(this.audio).animate({volume: 0}, 500, function(){
      lobby.apps.app_player.audio.pause();
      lobby.apps.app_player.audio = lobby.apps.app_player.fetch_audio(candidate.track, "ambient", candidate.url, true);
      lobby.apps.app_player.audio.play();
      $(lobby.apps.app_player.audio).animate({volume: 1}, 500);
    });
  }

  this.fetch_audio = function(name, role, src, loop = false)
  {
      var audio_id = role + "_" + name;
      if (!(audio_id in this.catalog))
      {
        var audio = new Audio();
        audio.name = name;
        audio.src = src;
        audio.loop = loop;
        this.catalog[audio_id] = audio;
      }
      this.catalog[audio_id].currentTime = 0;
      return this.catalog[audio_id];
  }

  this.query_tracks = function()
  {
    var app = this;
    $.get("http://localhost:8888/query:player", function( data ){
      app.directory = JSON.parse(data);
      app.search_el.innerHTML = app.directory.length+"t";
    }); 
  }
}