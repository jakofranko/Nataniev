function Util()
{
	App.call(this);

  this.name = "util";
  this.size = {width:lobby.size.width,height:300};
  this.origin = {x:0,y:0};
  this.theme = "ghost";
  this.methods.set_wallpaper = {name:"set_wallpaper"};
  this.methods.say = {name:"say"};

  this.logs = [];

  this.widget_el = document.createElement("t");

  this.on_launch = function()
  {
    this.say("init");
  }

  this.say = function(q)
  {
    this.call(null,q,null);  
  }

  this.call_back = function(m,r)
  {
    var lines = r;
    for(r_id in lines){
      console.log(r_id)
      this.log(lines[r_id].text);
    }
  }

  this.log = function(content)
  {
    if(!lobby.apps.clock){ return; }
    this.logs.push(content);

    this.wrapper_el.innerHTML = "";

    html = "";
    for(log_id in this.logs){
      html += "<ln class='half'><t class='f9 w2 di'>"+lobby.apps.clock.time()+"</t> <t class='ff'>"+this.logs[log_id]+"</t></ln>\n";
    }
    this.wrapper_el.innerHTML += html;
  }

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
}

lobby.install_callback("Util");