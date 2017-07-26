function System()
{
  App.call(this);

  this.name = "system";
  this.size = {width:300,height:300};
  this.origin = {x:120,y:120};

  this.widget_el = document.createElement("t"); this.widget_el.className = "toggle";

  this.on_start = function()
  {
    lobby.commander.install_widget(this.widget_el);
    this.on_window_resize();

    var app = this;
    this.widget_el.addEventListener("mousedown", function(){ app.toggle() }, true);

    this.el.innerHTML = "System: ";
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
}

lobby.install_callback("System");
