function App()
{
	this.name = "global";
	this.size = {width:60,height:60};
	this.origin = {x:0,y:0};
  this.theme = "";
  this.methods = {};
  this.methods.start = {name:"start",is_global:true};
  this.methods.exit = {name:"exit",is_global:true};
  this.methods.hide = {name:"hide",is_global:true};
  this.methods.show = {name:"show",is_global:true};
  this.methods.full = {name:"full",is_global:true};
  this.methods.mini = {name:"mini",is_global:true};
  this.methods.ghost = {name:"ghost",is_global:true};

  this.is_visible = false;
  this.has_launched = false;

	this.el = document.createElement("yu"); 
	this.el.className = "app";
	this.wrapper_el = document.createElement("yu"); 
	this.wrapper_el.className = "wrapper";
	this.el.appendChild(this.wrapper_el);

  this.el.addEventListener("mousedown", mouse_down, false);
  this.el.addEventListener("mouseup", mouse_up, false);
  this.el.addEventListener("mousemove", mouse_move, false);

  this.wrapper_el.addEventListener("mousedown", function(e){ e.stopPropagation(); }, false);

  this.includes = [];

  // Installation

  this.install = function()
  {
    console.log("Installing "+this.name);
    this.el.className += " "+this.name+" "+this.theme;
    this.el.id = this.name;
    if(this.includes.length > 0){
      this.install_includes(this.includes);
    }
    this.start();
  }

  this.install_includes = function(files)
  {
    for(file_id in files){
      this.try_include(files[file_id]);
    }
  }

  this.try_include = function(file_name)
  {
    console.log("Including "+file_name+" to "+this.name);
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'public.lobby/scripts/apps/app.'+this.name+'/'+file_name+'.js';
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  // AJAX

  this.call = function(method,params = null,vessel = this.name)
  {
    var app = this;
    var url = ("http://localhost:8668/:maeve "+(vessel ? vessel+"."+method+' ' : '')+(params ? params : "")).trim().replace(/ /g, '+'); 
    console.log("Calling..",url)
    $.get(url).done(function(response){
      try {
        var a = JSON.parse(response);
      } catch(e) {
        console.log(e,response);
      }
      if(a){
        app.call_back(method,a)  
      }
      
    },"json");
  }

  this.call_back = function(m,r)
  {
    console.log(this.name+"."+m+" answered",r);
  }

  this.get_url = function(url)
  {
    var app = this;
    lobby.apps.util.log(url);
    $.get(url, function( data ){
      console.log(data);
      app.get_url_callback(url,JSON.parse(data))
    }); 
  }

  this.get_url_callback = function(url,r)
  {
    console.log(this.name+"."+url+" answered",r);
  }

  this.default = function()
  {
    this.launch();
  }

  this.on_launch = function()
  {

  }

  this.exit = function()
  {
    
  }

  this.on_start = function(){}
  this.on_exit = function(){}
  this.on_resize = function(){}
  this.on_move = function(){}
  this.on_window_resize = function(){}

  // Change styles

  this.start = function()
  {
    this.on_start();
  }

  this.launch = function()
  {
    console.log("Launching "+this.name);
    $(this.el).css("width",0).css("height",0).css("top",this.origin.y).css("left",this.origin.x);
    lobby.el.appendChild(this.el);

    $(this.el).animate({ left: this.origin.x, top: this.origin.y, width: this.size.width, height: this.size.height }, 300, this.on_launch());
    this.is_visible = true;
    this.has_launched = true;
    this.select();
  }

  this.select = function()
  {
    lobby.commander.deselect();
    $(this.el).addClass("selected");
    lobby.commander.select(this);
  }

  this.deselect = function()
  {
    $(this.el).removeClass("selected");
  }

  this.toggle = function()
  {
    if(this.is_visible){
      this.hide();
    }
    else{
      if(!this.has_launched){
        this.launch();
      }
      else{
        this.show();
      }
    }
  }

  this.show = function()
  {
    $(this.el).removeClass("hidden");
    $(this.el).removeClass("ghost");
    this.is_visible = true;
    this.select();
  }

  this.hide = function()
  {
    $(this.el).addClass("hidden");
    this.is_visible = false;
    this.deselect();
  }

  this.ghost = function()
  {
    $(this.el).removeClass("hidden");
    $(this.el).removeClass("noir");
    $(this.el).addClass("ghost");
  }

  this.noir = function()
  {
    $(this.el).removeClass("hidden");
    $(this.el).removeClass("ghost");
    $(this.el).addClass("noir");
  }


  this.full = function()
  {
    this.resize_window_to(lobby.size.width,lobby.size.height);
    this.move_window_to(-30,-30)
  }

  this.mini = function()
  {
    this.resize_window_to(180,180);
    this.move_window_to(30,30)
  }

  //

	this.align_to_grid = function()
	{
		var target = {x:parseInt(this.el.style.left),y:parseInt(this.el.style.top)};
		target.x = (parseInt(target.x / 30) * 30)+"px"
		target.y = (parseInt(target.y / 30) * 30)+"px"
		$(this.el).animate({ left: target.x, top: target.y }, 300);
	}

  this.hint = function(value)
  {
    var html = "";
    var method = value.indexOf(".") > -1 ? value.split(".")[1].split(" ")[0] : null;

    if(this.methods[method]){
      return "<span class='param'>"+this.methods[method].name+"</span> ";
    }
    for(method_id in this.methods){
      if(this.methods[method_id].is_global){ continue; }
      html += "<span class='method'>."+method_id+"</span> ";
    }
    for(method_id in this.methods){
      if(!this.methods[method_id].is_global){ continue; }
      html += "<span class='method global'>."+method_id+"</span> ";
    }
    return html;
  }

	// MOUSE

	this.touch = null;

	this.on_mouse_down = function(e)
	{
    event.stopPropagation();
    $(this.el).addClass("dragged");
		this.touch = {x: e.clientX, y: e.clientY};
		this.select();
		e.preventDefault();
	}

	this.on_mouse_move = function(e)
	{
		if(this.touch === null){ return; }

		var position = {x: parseInt(this.el.style.left), y: parseInt(this.el.style.top)}
		var offset = {x: e.clientX - this.touch.x,y: e.clientY - this.touch.y}
		var new_position = {x: (position.x + offset.x), y:(position.y + offset.y)};

		if(new_position.x < -30){ new_position.x = -30; }
		if(new_position.y < 0){ new_position.y = 0; }
		// if((new_position.y + this.size.height) > window.innerHeight - 120){ new_position.y = window.innerHeight - 180; }

		this.el.style.top = new_position.y+"px";
		this.el.style.left = new_position.x+"px";

		this.touch = {x: e.clientX, y: e.clientY};
		e.preventDefault();
	}

	this.on_mouse_up = function(e)
	{
    $(this.el).removeClass("dragged");
		this.touch = null;
		this.align_to_grid();
		e.preventDefault();
	}

  this.is_typing = function()
  {
    if(document.activeElement.type == "textarea"){ return true; }
    if(document.activeElement.type == "input"){ return true; }
    return false;
  }

	function mouse_down(e)
	{
		if(!lobby.apps[this.id]){ return; }
		lobby.apps[this.id].on_mouse_down(e);
    lobby.commander.input_el.blur();
	}

	function mouse_move(e)
	{
		if(!lobby.apps[this.id]){ return; }
		lobby.apps[this.id].on_mouse_move(e);
	}

	function mouse_up(e)
	{
		if(!lobby.apps[this.id]){ return; }
		lobby.apps[this.id].on_mouse_up(e);
	}


  // Keyboard Numbers
  this.key_number_0 = function(){ }
  this.key_number_1 = function(){ }
  this.key_number_2 = function(){ }
  this.key_number_3 = function(){ }
  this.key_number_4 = function(){ }
  this.key_number_5 = function(){ }
  this.key_number_6 = function(){ }
  this.key_number_7 = function(){ }
  this.key_number_8 = function(){ }
  this.key_number_9 = function(){ }
  // Keyboard Notes
  this.key_letter_a = function(){ }
  this.key_letter_s = function(){ }
  this.key_letter_d = function(){ }
  this.key_letter_f = function(){ }
  this.key_letter_g = function(){ }
  this.key_letter_h = function(){ }
  this.key_letter_j = function(){ }
  // Keyboard Notes sharp
  this.key_letter_w = function(){ }
  this.key_letter_e = function(){ }
  this.key_letter_t = function(){ }
  this.key_letter_y = function(){ }
  this.key_letter_u = function(){ }
  // Controls
  this.key_letter_c = function(){ }
  this.key_letter_v = function(){ }
  // Controls up/down
  this.key_letter_x = function(){ }
  this.key_letter_z = function(){ }
  // Brackets
  this.key_square_bracket_right = function(){ this.resize_window(30,0); }
  this.key_square_bracket_left  = function(){ this.resize_window(-30,0); }
  this.key_curly_bracket_right  = function(){ this.resize_window(0,30); }
  this.key_curly_bracket_left   = function(){ this.resize_window(0,-30);}
  // Keyboard Hex
  this.key_letter_a = function(){ }
  this.key_letter_b = function(){ }
  this.key_letter_c = function(){ }
  this.key_letter_d = function(){ }
  this.key_letter_e = function(){ }
  this.key_letter_f = function(){ }
  // Arrows
  this.key_arrow_up    = function(){ }
  this.key_arrow_down  = function(){ }
  this.key_arrow_left  = function(){ }
  this.key_arrow_right = function(){ }
  // Etc
  this.key_escape      = function(){ 
    lobby.commander.deselect(); lobby.commander.input_el.blur(); 
  }
  this.key_delete      = function(){

  }
  this.key_enter       = function(){ 

    lobby.commander.validate(); 
  }

	// Keyboard controls
	this.key_arrow_right = function()
	{
    if(lobby.commander.is_typing() || this.is_typing()){ return; }
		this.move_window(30,0);
	}
	this.key_arrow_left = function()
	{
    if(lobby.commander.is_typing() || this.is_typing()){ return; }
		this.move_window(-30,0);
	}
	this.key_arrow_up = function()
	{
    if(lobby.commander.is_typing() || this.is_typing()){ return; }
		this.move_window(0,-30);
	}
	this.key_arrow_down = function()
	{
    if(lobby.commander.is_typing() || this.is_typing()){ return; }
		this.move_window(0,30);
	}

  this.move_window = function(x,y)
  {
    var new_position = {x: parseInt(this.el.style.left) + x, y: parseInt(this.el.style.top) + y}

    if(new_position.x < -30){ new_position.x = -30; }
    if(new_position.y < -30){ new_position.y = -30; }

    new_position.x = (parseInt(new_position.x / 30) * 30)+"px";
    new_position.y = (parseInt(new_position.y / 30) * 30)+"px";
    $(this.el).animate({ left: new_position.x, top: new_position.y }, 50);
    this.on_move();
  }

  this.move_window_to = function(x,y)
  {
    $(this.el).animate({ left: x, top: y }, 50);
    this.on_move();
  }

  this.resize_window = function(x,y)
  {
    if(this.size.width + x < 30 || this.size.height + y < 30){ return; }
    var app_size = this.size;
    $(this.el).animate({ width: app_size.width + x, height: app_size.height + y }, 50);
    this.size = {width:app_size.width+x,height:app_size.height+y};
    this.on_resize();
  }

  this.resize_window_to = function(x,y)
  {
    var app = this;
    $(this.el).animate({ width: x, height: y }, 50, function(){ app.size = {width:x,height:y}; });
    this.on_resize();
  }
}