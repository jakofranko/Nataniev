function Terminal()
{
	App.call(this);

  this.name = "terminal";
  this.size = {width:lobby.size.width,height:30};
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
    this.log(q,">");
    this.call(null,q,null);  
  }

  this.call_back = function(m,r)
  {
    var lines = r;
    for(r_id in lines){
      this.log(lines[r_id].text,lines[r_id].glyph);
    }
  }

  this.log = function(content,glyph = " ")
  {
    if(!lobby.apps.clock){ return; }
    this.logs.push({time: lobby.apps.clock.time(),text:content, glyph:glyph});

    this.wrapper_el.innerHTML = "";

    html = "";
    for(log_id in this.logs){
      html += "<ln class='half ff'><t class='f9 w2 di'> "+this.logs[log_id].time+"</t><t class='di w1 f9'>"+this.logs[log_id].glyph+"</t><t>"+this.logs[log_id].text+"</t></ln>\n";
    }

    while(this.logs.length > 20){
      this.logs.shift();
    }

    this.wrapper_el.innerHTML += html;
    this.resize_window_to(lobby.size.width - 60,this.logs.length * 15)
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

lobby.install_callback("Terminal");
