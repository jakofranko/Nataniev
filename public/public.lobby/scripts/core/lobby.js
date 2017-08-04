function Lobby()
{
  this.el = document.createElement("yu"); this.el.id = "lobby";
  this.grid_el = document.createElement("yu"); this.grid_el.id = "grid";
  this.size = {width:0,height:0};
  this.commander = new Commander();
  this.keyboard = new Keyboard();
  this.apps = {};

  window.addEventListener('resize', on_resize, false);

	this.init = function()
	{
		document.body.appendChild(this.el);
		this.el.appendChild(this.grid_el);
		this.el.appendChild(this.commander.el);

		this.start();
	}

	this.start = function()
	{
		this.keyboard.start();
		this.commander.install();
		lobby.update_size();

		this.summon.invoke("Terminal");
		this.summon.invoke("Clock");
		this.summon.invoke("Calendar");
		this.summon.invoke("Ide");
		this.summon.invoke("Ronin");
		this.summon.invoke("System");
		this.summon.invoke("Dict");
		this.summon.invoke("Diary");
		this.summon.invoke("Pong");
		this.summon.invoke("Marabu");

		setTimeout(function(){ lobby.on_ready(); }, 1000);
	}

	this.summon = 
	{
		queue : [],
		known : [],

		invoke : function(name)
		{
			console.log("invoke",name);
			this.queue.push(name);
			this.inject(name);
		},

		confirm : function(name)
		{
			console.log("confirm",name);
			this.known.push(name);
			var q = [];
			for(app_id in this.queue){
				if(name == this.queue[app_id]){ continue; }
				q.push(this.queue[app_id]);
			}
			this.queue = q;
			if(this.queue.length == 0){ this.complete(); }
		},

		inject : function(name)
		{
			var s = document.createElement('script');
			s.type = 'text/javascript';
			s.src = 'public.lobby/scripts/apps/app.'+name.toLowerCase()+'/main.js';
		  document.getElementsByTagName('head')[0].appendChild(s);
		},

		complete : function()
		{
			for(app_id in this.known){
				var app = new window[this.known[app_id]]();
				app.setup.install();
			}
			lobby.commander.update_hint();
		}
	}
	

	this.on_ready = function()
	{
		this.apps.system.setup.launch();
		// this.apps.diary.launch();
	}

	function on_resize()
	{
		lobby.update_size();

		for(app in lobby.apps){
			lobby.apps[app].on_window_resize();
		}
	}

	this.update_size = function()
	{
		var new_size = {width: parseInt(window.innerWidth/30.0) * 30 - 60,height: parseInt(window.innerHeight/30.0) * 30 - 30}
		lobby.el.style.width = new_size.width+"px";
		lobby.el.style.height = new_size.height+"px";
		this.size = new_size;
	}

	this.screen_center = function()
	{
		return {width: parseInt(window.innerWidth/2/230.0) * 30 - 60,height: parseInt(window.innerHeight/2/30.0) * 30 - 30}
	}


  // 
  // Touch
  // 

	this.touch = 
	{
		app : null,
    from : null,

		bind : function(app)
		{
			console.log("bind",app.name);
			lobby.touch.app = app;
		},

		release : function()
		{
    	if(!lobby.touch.app){ return; }

			console.log("released",lobby.touch.app.name);
			lobby.touch.app.window.align();
			lobby.touch.app = null;
		},

		down : function(e)
    {
    	lobby.touch.from = {x: e.clientX, y: e.clientY};
    	e.preventDefault();
    },

    move : function(e)
    {
    	if(!lobby.touch.app){ return; }

    	var position = lobby.touch.app.window.pos;
			var offset = {x: e.clientX - lobby.touch.from.x,y: e.clientY - lobby.touch.from.y}
			var new_position = {x: parseInt(position.x + offset.x), y:parseInt(position.y + offset.y)};

			if(new_position.x < -30){ new_position.x = -30; }
			if(new_position.y < -30){ new_position.y = -30; }

			lobby.touch.app.window.pos = new_position;
			lobby.touch.app.window.update(false);

			lobby.touch.from = {x: e.clientX, y: e.clientY};

    	e.preventDefault();
    },

    up : function(e)
    {
    	e.preventDefault();
    	lobby.touch.release();
    	lobby.touch.from = null;
    }

	}

  this.el.addEventListener("mousedown", this.touch.down, false);
  this.el.addEventListener("mouseup", this.touch.up, false);
  this.el.addEventListener("mousemove", this.touch.move, false);
}