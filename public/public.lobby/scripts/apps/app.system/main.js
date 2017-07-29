function System()
{
  App.call(this);

  this.name = "system";
  this.size = {width:420,height:300};
  this.origin = {x:300,y:30};
  this.methods.set_wallpaper = {name:"set_wallpaper"};
  this.methods.set_theme = {name:"set_theme"};

  this.formats = ["jpg","png"];

  this.widget_el = document.createElement("t"); this.widget_el.className = "toggle";

  this.on_installation_complete = function()
  {
    lobby.commander.install_widget(this.widget_el);
    this.on_window_resize();

    var app = this;
    this.widget_el.addEventListener("mousedown", function(){ app.toggle() }, true);
  }

  this.on_launch = function()
  {
    this.update();
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

  this.on_window_resize = function()
  {
    this.widget_el.innerHTML = lobby.size.width+"x"+lobby.size.height;
  }

  this.set_wallpaper = function(val, is_passive = false)
  {
    if(is_passive){
      lobby.commander.show_browser();
      lobby.commander.browse_candidates(val,this.formats);
    }
    else{
      lobby.commander.hide_browser();
      lobby.el.style.backgroundImage = "url(/"+lobby.commander.select_candidate(val,this.formats).replace('/public','')+")";
      lobby.commander.notify("Updated Wallpaper")
    }    
  }

  this.set_theme = function()
  {

  }
}

lobby.install_callback("System");
