function Lobby()
{
	this.el = document.createElement("yu"); this.el.id = "lobby";
	this.grid_el = document.createElement("yu"); this.grid_el.id = "grid";

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

		this.try_install("Util");
		this.try_install("Oscean");
		this.try_install("Twitter");
		this.try_install("Editor");
		this.try_install("Rotonde");
		this.try_install("Marabu");
		this.try_install("Clock");

		setTimeout(function(){ lobby.on_ready(); }, 1000);
	}

	this.on_ready = function()
	{
		// console.log(this.apps.util);
		this.apps.clock.launch();
	}

	function on_resize()
	{
		lobby.update_size();
	}

	this.update_size = function()
	{
		var new_size = {width: parseInt(window.innerWidth/30.0) * 30 - 60,height: parseInt(window.innerHeight/30.0) * 30 - 30}
		lobby.el.style.width = new_size.width+"px";
		lobby.el.style.height = new_size.height+"px";
		lobby.commander.size_el.innerHTML = new_size.width+"x"+new_size.height;
	}

	this.screen_center = function()
	{
		return {width: parseInt(window.innerWidth/2/230.0) * 30 - 60,height: parseInt(window.innerHeight/2/30.0) * 30 - 30}
	}
}
