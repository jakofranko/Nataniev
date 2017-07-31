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

	this.try_install = function(app_name)
	{
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = 'public.lobby/scripts/apps/app.'+app_name.toLowerCase()+'/main.js';
	  document.getElementsByTagName('head')[0].appendChild(s);
	}

	this.install_callback = function(app_name)
	{
		var app = new window[app_name]();

		this.apps[app.name.toLowerCase()] = app;
		app.install();
		this.commander.update_hint();
	}

	this.start = function()
	{
		this.keyboard.start();
		this.commander.install();
		lobby.update_size();

		this.try_install("Terminal");
		this.try_install("Clock");
		this.try_install("Calendar");
		this.try_install("Ide");
		this.try_install("Ronin");
		this.try_install("System");
		this.try_install("Dict");
		this.try_install("Diary");
		this.try_install("Pong");
		this.try_install("Marabu");

		setTimeout(function(){ lobby.on_ready(); }, 1000);
	}

	this.on_ready = function()
	{
		// this.apps.terminal.launch();
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
}
