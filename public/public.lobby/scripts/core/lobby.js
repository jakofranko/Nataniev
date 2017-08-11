function Lobby()
{
  this.el = document.createElement("yu"); this.el.id = "lobby";
  this.grid_el = document.createElement("yu"); this.grid_el.id = "grid";
  this.wallpaper_el = document.createElement("yu"); this.wallpaper_el.id = "wallpaper";
  this.commander = new Commander();
  this.keyboard = new Keyboard();
  this.apps = {};

  this.init = function()
  {
    console.info("Init.");

    document.body.appendChild(this.el);
    this.el.appendChild(this.grid_el);
    this.el.appendChild(this.wallpaper_el);
    this.el.appendChild(this.commander.el);
    
    this.keyboard.start();
    this.commander.install();
    lobby.window.update();

    this.summon.invoke("Terminal");
    this.summon.invoke("Clock");
    this.summon.invoke("Calendar");
    this.summon.invoke("Ide");
    this.summon.invoke("Ronin");
    this.summon.invoke("System");
    this.summon.invoke("Dict");
    this.summon.invoke("Diary");
    this.summon.invoke("Pong");
    this.summon.invoke("Twitter");
    // this.summon.invoke("Typographer");
  }

  // 
  // Summon
  // 

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
			this.known.push(name);
			var q = [];
			for(app_id in this.queue){
				if(name == this.queue[app_id]){ continue; }
				q.push(this.queue[app_id]);
			}
			this.queue = q;
			if(this.queue.length == 0){ this.install(); }
		},

		inject : function(name)
		{
			var s = document.createElement('script');
			s.type = 'text/javascript';
			s.src = 'public.lobby/scripts/apps/app.'+name.toLowerCase()+'/main.js';
		  document.getElementsByTagName('head')[0].appendChild(s);
		},

		install : function()
		{
      console.info("Installing "+this.known.length+" apps.");
      
      // Register
			for(app_id in this.known){
				var app = new window[this.known[app_id]]();
        lobby.apps[app.name] = app;
			}

      // Install
      for(app_id in lobby.apps){
        var app = lobby.apps[app_id];
        app.setup.install();
      }
		},

    update : function()
    {
      for(app_id in lobby.apps){
        var app = lobby.apps[app_id];
        if(app.setup.is_complete == false){
          return;
        }
      }
      this.ready();
    },

    ready : function()
    {
      console.info("Ready.");
      lobby.el.className = "ready";
      lobby.commander.update_hint();
    
      // lobby.apps.system.setup.launch();
      // lobby.apps.diary.setup.launch();
      // lobby.apps.typographer.setup.launch();
    }
	}

  // 
  // Window
  // 

  this.window = 
  {
    size : {width: parseInt(window.innerWidth/30.0) * 30 - 60,height: parseInt(window.innerHeight/30.0) * 30 - 30},

    update : function()
    {
      var new_size = {width: parseInt(window.innerWidth/30.0) * 30 - 60,height: parseInt(window.innerHeight/30.0) * 30 - 30}
      lobby.el.style.width = new_size.width+"px";
      lobby.el.style.height = new_size.height+"px";
      this.size = new_size;
    },

    center : function()
    {
      return {x: parseInt(window.innerWidth/2/30.0) * 30 - 30,y: parseInt(window.innerHeight/2/30.0) * 30 - 30}
    },

    horizontal_half : function()
    {
      return {width: parseInt(window.innerWidth/2/30.0) * 30 - 60,height: parseInt(window.innerHeight/30) * 30 - 120}
    }
  }

  // 
  // WHEN
  // 

  this.when = 
  {
    resize : function()
    {
      lobby.window.update();
      for(app in lobby.apps){
        lobby.apps[app].when.resize();
      }
    }
  }


  // 
  // Touch
  // 

	this.touch = 
	{
		app : null,
    from : null,
    depth : 100,

		bind : function(app)
		{
			console.log("lobby.bind",app.name);
			lobby.touch.app = app;
			lobby.commander.input_el.blur();
      app.when.bind();
		},

		release : function()
		{
    	if(!lobby.touch.app){ return; }

			console.log("lobby.release",lobby.touch.app.name);
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
    },

    drag_over : function(e)
    {
      e.stopPropagation(); 
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    },

    drop_over : function(e)
    {
      e.stopPropagation(); 
      e.preventDefault();

      var files = e.dataTransfer.files;
      var file = files[0];

      console.log("Looking for handler",file)

      for(app_id in lobby.apps){
        var result = lobby.apps[app_id].when.file(file);
        if(result){ break; }
      }

    }
	}

  this.el.addEventListener("mousedown", this.touch.down, false);
  this.el.addEventListener("mouseup", this.touch.up, false);
  this.el.addEventListener("mousemove", this.touch.move, false);
  this.el.addEventListener('dragover', this.touch.drag_over, false);
  this.el.addEventListener('drop', this.touch.drop_over, false);

  window.addEventListener('resize', this.when.resize, false);
}
