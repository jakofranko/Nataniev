function App()
{
	this.name = "global";

  this.methods = {};
  this.methods.default = {name:"default",is_global:true};
  this.methods.exit = {name:"exit",is_global:true,shortcut:"w",run_shortcut:true};
  this.methods.toggle = {name:"toggle",is_global:true,shortcut:"h",run_shortcut:true};
  this.methods.ghost = {name:"ghost",is_global:true};
  this.methods.warp_right = {name:"warp_right",is_global:true,shortcut:"]",run_shortcut:true};
  this.methods.warp_left = {name:"warp_left",is_global:true,shortcut:"[",run_shortcut:true};
  this.methods.warp_center = {name:"warp_center",is_global:true,shortcut:"=",run_shortcut:true};
  this.methods.scale_right = {name:"scale_right",is_global:true,shortcut:"}",run_shortcut:true};
  this.methods.scale_left = {name:"scale_left",is_global:true,shortcut:"{",run_shortcut:true};
  this.methods.fill = {name:"fill",is_global:true,shortcut:"m",run_shortcut:true};

	this.el = document.createElement("yu"); this.el.className = "app";
	this.wrapper_el = document.createElement("yu"); this.wrapper_el.className = "wrapper";
	this.el.appendChild(this.wrapper_el);

  this.default = function()
  {
    this.window.show();
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

  var target = this;
  
  // 
  // Setup
  //   

  this.setup = 
  {
    app : target,
    includes : [],
    has_launched : false,

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
      if(this.has_launched){ return; }

      console.log("launch",this.app.name)
      lobby.el.appendChild(this.app.el);
      this.start();
      this.has_launched = true;
      this.app.window.start();
      this.start();
    },

    start : function()
    {
      console.log("start",this.app.name)
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
      this.pos = { x: parseInt(this.pos.x) + parseInt(pos.x), y: parseInt(this.pos.y) + parseInt(pos.y)};
      this.update();
      this.app.when.move();
    },

    move_to : function(pos)
    {
      this.pos = { x: parseInt(pos.x), y: parseInt(pos.y)};
      this.update();
      this.app.when.move();
    },

    resize_by : function(size)
    {
      this.size = { width: parseInt(this.size.width) + parseInt(size.width), height: parseInt(this.size.height) + parseInt(size.height)};
      this.update();
      this.app.when.resize();
    },

    resize_to : function(size)
    {
      this.size = { width: parseInt(size.width), height: parseInt(size.height)};
      this.update();
      this.app.when.resize();
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

    toggle : function()
    {
      if(this.is_visible){
        this.hide();
      }
      else{
        if(!this.app.setup.has_launched){
          this.app.setup.launch();
        }
        else{
          this.show();
        }
      }
    },

    show : function()
    {
      if(!this.app.setup.has_launched){
        this.app.setup.launch();
      }

      $(this.app.el).removeClass("hidden");
    },

    hide : function()
    {
      $(this.app.el).addClass("hidden");
    },

    organize : 
    {
      app : target,

      fill : function()
      {
        this.app.window.move_to({x:30,y:30});
        this.app.window.resize_to({width:lobby.window.size.width - 120, height: lobby.window.size.height - 150});
      },

      full : function()
      {
        this.app.window.move_to({x:-30,y:-30});
        this.app.window.resize_to(lobby.window.size);
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

  // 
  // WHEN
  // 

  this.when = 
  {
    app : target,
    
    move : function()
    {
      console.log("moved")
    },

    resize : function()
    {
      console.log("resized")
    },

    option_key : function(key) // Global
    {
      switch(key)
      {
        case "arrowup": this.app.window.move_by({x:0,y:-30}); break;
        case "arrowdown": this.app.window.move_by({x:0,y:30}); break;
        case "arrowleft": this.app.window.move_by({x:-30,y:0}); break;
        case "arrowright": this.app.window.move_by({x:30,y:0}); break;
        case "escape": this.app.window.organize.fill(); break;
      }
    },

    control_key : function(key) // Override
    {
      for(method_id in this.app.methods){
        var method = this.app.methods[method_id];
        if(method.shortcut != key){ continue; }
        console.log(this.app)
        console.log("Shortcut",method);
        if(method.run_shortcut){
          this.app[method.name](); 
          return;
        }
        else{
          lobby.commander.inject(this.app.name+"."+method.name+" ");
          lobby.commander.input_el.focus()
          return;
        }
      }
    }
  }

  // 
  // AJAX
  // 

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

  this.el.addEventListener("mousedown", this.touch.down, false);
  this.el.addEventListener("mouseup", this.touch.up, false);
  this.el.addEventListener("mousemove", this.touch.move, false);

  this.wrapper_el.addEventListener("mousedown", function(e){ e.stopPropagation(); }, false);
}
