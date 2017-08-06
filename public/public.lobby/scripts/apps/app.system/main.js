function System()
{
  App.call(this);

  this.name = "system";
  
  this.window.size = {width:420,height:420};
  this.window.pos = {x:300,y:30};

  this.methods.set_wallpaper = {name:"set_wallpaper",passive:true};
  this.methods.set_theme = {name:"set_theme"};

  this.widget_el = document.createElement("t"); this.widget_el.className = "toggle";

  this.setup.ready = function()
  {
    lobby.commander.install_widget(this.app.widget_el);

    var app = this.app;
    app.widget_el.addEventListener("mousedown", function(){ app.window.toggle() }, true);
    
    this.app.when.resize();
  }

  this.setup.start = function()
  {
    this.app.update();
  }

  this.update = function()
  {
    var html = ""

    for(app_id in lobby.apps){
      var app = lobby.apps[app_id];
      html += "<ln class='lh15'><b>"+app.name+"</b></ln> ";
      for(method_id in app.methods){
        var method = app.methods[method_id];
        if(method.is_global){ continue; }
        html += "<ln class='lh15 w6 f9 pdl'>."+method.name+" "+(method.shortcut ? '[ctrl+'+method.shortcut+']' : '')+"</ln> ";
      }
    }

    html += "<ln class='lh15'>GLOBALS</ln> ";
    for(method_id in this.methods){
      var method = this.methods[method_id];
      if(!method.is_global){ continue; }
      html += "<ln class='lh15 w6 f9 pdl'>."+method.name+" "+(method.shortcut ? '[ctrl+'+method.shortcut+']' : '')+"</ln> ";
    }

    this.el.innerHTML = "<list style='column-count:2'>"+html+"</list>";
  }

  this.on_input_change = function(value)
  {
    if(value.split(" ")[0] == "system.set_wallpaper"){
      var val = value.split(" "); val.shift(); val = val.join(" ").trim();
      this.set_wallpaper(val,true);
    }
  }

  this.when.resize = function()
  {
    this.app.widget_el.innerHTML = lobby.window.size.width+"x"+lobby.window.size.height;
  }

  this.set_wallpaper = function(val, is_passive = false)
  {
    if(is_passive){
      lobby.commander.show_browser();
      lobby.commander.browse_candidates(val,["jpg","png"]);
      return;
    }
    lobby.commander.hide_browser();
    lobby.wallpaper_el.style.backgroundImage = "url(/"+lobby.commander.select_candidate(val,["jpg","png"]).replace('/public','')+")";
    lobby.commander.notify("Updated Wallpaper")   
  }

  this.set_theme = function()
  {

  }
}

lobby.summon.confirm("System");
