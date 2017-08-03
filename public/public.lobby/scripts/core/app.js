function App()
{
	this.name = "global";

  this.methods = {};
  this.methods.exit = {name:"exit",is_global:true,shortcut:"w",run_shortcut:true};
  this.methods.toggle = {name:"toggle",is_global:true,shortcut:"h",run_shortcut:true};
  this.methods.ghost = {name:"ghost",is_global:true};
  this.methods.warp_right = {name:"warp_right",is_global:true,shortcut:"]",run_shortcut:true};
  this.methods.warp_left = {name:"warp_left",is_global:true,shortcut:"[",run_shortcut:true};
  this.methods.warp_center = {name:"warp_center",is_global:true,shortcut:"=",run_shortcut:true};
  this.methods.scale_right = {name:"scale_right",is_global:true,shortcut:"}",run_shortcut:true};
  this.methods.scale_left = {name:"scale_left",is_global:true,shortcut:"{",run_shortcut:true};
  this.methods.fill = {name:"fill",is_global:true,shortcut:"m",run_shortcut:true};

  this.is_visible = false;
  this.has_launched = false;

	this.el = document.createElement("yu"); this.el.className = "app";
	this.wrapper_el = document.createElement("yu"); this.wrapper_el.className = "wrapper";
	this.el.appendChild(this.wrapper_el);

  // Installation

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

  this.hint = function(value)
  {
    var html = "";
    var method = value.indexOf(".") > -1 ? value.split(".")[1].split(" ")[0] : null;

    // Autocomplete
    for(method_id in this.methods){
      if(this.methods[method_id].is_global){continue; }
      var method_name = this.methods[method_id].name;
      if(method_name.indexOf(method) > -1){
        html += "<t class='autocomplete'>"+method_name.replace(method,'')+"</t>";
        lobby.commander.autocomplete = this.name+"."+method_name+" ";
        break;
      }
    }

    if(this.methods[method]){
      return "<span class='param'> "+(this.methods[method].params ? ' > '+this.methods[method].params : ' > ')+"</span> ";
    }
    for(method_id in this.methods){
      var method = this.methods[method_id];
      if(method.is_global){ continue; }
      html += " <span class='method'>."+method_id+(method.shortcut ? '('+method.shortcut+')' :'')+"</span> ";
    }
    for(method_id in this.methods){
      var method = this.methods[method_id];
      if(!method.is_global){ continue; }
      html += " <span class='method global'>."+method_id+(method.shortcut ? '('+method.shortcut+')' :'')+"</span> ";
    }
    return html;
  }

  this.on_key = function(k)
  {
    // console.log(k)
  }

  this.is_typing = function()
  {
    if(document.activeElement.type == "textarea"){ return true; }
    if(document.activeElement.type == "input"){ return true; }
    return false;
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
  // this.key_square_bracket_right = function(){ this.resize_window(30,0); }
  // this.key_square_bracket_left  = function(){ this.resize_window(-30,0); }
  // this.key_curly_bracket_right  = function(){ this.resize_window(0,30); }
  // this.key_curly_bracket_left   = function(){ this.resize_window(0,-30);}
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
  this.key_escape = function()
  { 
    lobby.commander.hide_browser();
  }

  this.key_delete = function()
  {

  }

  this.key_enter = function()
  { 
    lobby.commander.validate(); 
  }

  this.on_option = function(key)
  {
    switch(key)
    {
      case "arrowup": this.window.move_by({x:0,y:-30}); event.preventDefault(); break;
      case "arrowdown": this.window.move_by({x:0,y:30}); event.preventDefault(); break;
      case "arrowleft": this.window.move_by({x:-30,y:0}); event.preventDefault(); break;
      case "arrowright": this.window.move_by({x:30,y:0}); event.preventDefault(); break;
    }
  }

  this.on_shortcut = function(key)
  {
    if(!lobby.commander.app){ return; }

    for(method_id in this.methods){
      var method = this.methods[method_id];
      if(method.shortcut != key){ continue; }
      if(method.run_shortcut){
        this[method.name](); 
        return;
      }
      else{
        lobby.commander.inject(this.name+"."+method.name+" ");
        lobby.commander.input_el.focus()
        return;
      }
    }
    console.log("Unknown shortcut:",key);
  }

  // MESS ==========================

  this.default = function()
  {
    this.show();
  }

  this.exit = function()
  {
    
  }

  this.on_input_change = function(value){}
  this.on_installation_complete = function(){}
  this.on_exit = function(){}
  this.on_resize = function(){}
  this.on_move = function(){}
  this.on_window_resize = function(){}

  // Change styles

  this.launch = function()
  {
    lobby.el.appendChild(this.el);
    this.window.start();

    this.is_visible = true;
    this.has_launched = true;
    this.select();
    this.on_launch();
  }

  this.on_launch = function()
  {
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
    if(!this.has_launched){
      this.launch();
      this.setup.launch();
    }

    $(this.el).removeClass("hidden");
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

  this.blanc = function()
  {
    $(this.el).removeClass("hidden");
    $(this.el).removeClass("ghost");
    $(this.el).addClass("blanc");
  }

  this.warp_left = function()
  {
    this.window.move_by(-30,-30);
    this.window.resize_to(lobby.size.width/2 - 30,lobby.size.height-30);
  }
  this.warp_right = function()
  {
    this.window.move_by(lobby.size.width/2 - 30,-30);
    this.window.resize_to(lobby.size.width/2,lobby.size.height-30);
  }
  this.warp_center = function()
  {
    this.window.move_by(30,30);
    this.window.resize_to(lobby.size.width - 120,lobby.size.height - 150);
  }

  this.scale_left = function()
  {
    this.window.resize_by(-30,-30);
  }

  this.scale_right = function()
  {
    this.window.resize_by(30,30);
  }

  this.fill = function()
  {
    this.window.resize_to(lobby.size.width,lobby.size.height - 30);
    this.window.move_to(-30,-30)
  }



  // MESS ==========================

  var target = this;
  
  // 
  // Setup
  //   

  this.setup = 
  {
    app : target,
    includes : [],

    install : function()
    {
      console.log("install",this.app.name)
      this.register();

      for(file_id in this.includes){
        this.inject(this.includes[file_id]);
      }
      this.ready();
    },

    register : function()
    {
      lobby.apps[this.app.name] = this.app;
    },

    inject : function(name)
    {
      console.log("inject",this.app.name+" > "+name);
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = 'public.lobby/scripts/apps/app.'+this.app.name+'/'+name+'.js';
      document.getElementsByTagName('head')[0].appendChild(s);
    },

    ready : function()
    {
      console.log("ready",this.app.name)
    },

    launch : function()
    {
      console.log("launch",this.app.name)
    },

    exit : function()
    {
      console.log("exit",this.app.name)
    }
  }

  // 
  // Window
  // 

  this.window = 
  {
    app : target,
    size : { width:200, height:200 },
    pos : { x: 0, y: 0 },
    theme : "blanc",
    speed : 50,

    start : function()
    {
      this.move_to(this.pos);
      this.resize_to(this.size);
    },

    move_by : function(pos)
    {
      this.pos = { x: this.pos.x + pos.x, y: this.pos.y + pos.y};
      this.update();
      this.app.on_move();
    },

    move_to : function(pos)
    {
      this.pos = pos;
      this.update();
      this.app.on_move();
    },

    resize_by : function(size)
    {
      this.size = { width: this.size.width + size.width, height: this.size.height + size.height};
      this.update();
      this.app.on_resize();
    },

    resize_to : function(size)
    {
      this.size = size;
      this.update();
      this.app.on_resize();
    },
    
    update : function(animate = true)
    {
      if(animate){
        $(this.app.el).animate({ left: this.pos.x, top: this.pos.y }, this.speed);
        $(this.app.el).animate({ width: this.size.width, height: this.size.height }, this.speed);  
      }
      else{
        $(this.app.el).css("left",this.pos.x).css("top",this.pos.y);
        $(this.app.el).css("width",this.size.width).css("height",this.size.height);
      }
    },

    align : function()
    {
      var target_pos = this.pos;
      target_pos.x = (parseInt(this.pos.x / 30) * 30)+"px"
      target_pos.y = (parseInt(this.pos.y / 30) * 30)+"px"
      $(this.app.el).animate({ left: target_pos.x, top: target_pos.y }, 300);
    },

    organize : 
    {
      app : target,

      fill : function()
      {

      },

      full : function()
      {

      }
    }
  }

  // 
  // Touch
  // 

  this.touch = 
  {
    app : target,
    from : null,

    down : function(e)
    {
      lobby.touch.bind(target);
      $(target.el).addClass("dragged");
    },

    move : function(e)
    {

    },

    up : function(e)
    {
      lobby.touch.release(target);
      $(target.el).removeClass("dragged");
    }

  }

  this.el.addEventListener("mousedown", this.touch.down, false);
  this.el.addEventListener("mouseup", this.touch.up, false);
  this.el.addEventListener("mousemove", this.touch.move, false);
  
  this.wrapper_el.addEventListener("mousedown", function(e){ e.stopPropagation(); }, false);
}
