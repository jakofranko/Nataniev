function Util()
{
	App.call(this);

  this.name = "util";
  this.size = {width:420,height:90};
  this.origin = {x:120,y:120};
  this.theme = "noir";
  this.methods.set_wallpaper = {name:"set_wallpaper"};

  this.logs = [];

  this.widget_el = document.createElement("t");

  this.on_start = function()
  {
    lobby.commander.install_widget(this.widget_el);
    this.on_window_resize();
  }

  this.on_window_resize = function()
  {
    this.widget_el.innerHTML = lobby.size.width+"x"+lobby.size.height;
  }

  this.set_wallpaper = function(image_url)
  {
    lobby.el.style.backgroundImage = "url("+image_url+")";
    this.log("Updated wallpaper.")
  }

  this.log = function(content)
  {
    if(!lobby.apps.clock){ return; }
    this.logs.push(content);

    html = "";
    for(log_id in this.logs){
      html += "<ln class='half'><t class='f9'>"+lobby.apps.clock.time()+"</t> <t class=''>"+this.logs[log_id]+"</t></ln>\n";
    }
    this.wrapper_el.innerHTML += html;
  }

  this.log("Started");
}

lobby.install_callback("Util");