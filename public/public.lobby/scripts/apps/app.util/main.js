function Util()
{
	App.call(this);

  this.name = "util";
  this.size = {width:420,height:90};
  this.origin = {x:120,y:120};
  this.theme = "noir";
  this.methods.set_wallpaper = {name:"set_wallpaper"};

  this.logs = [];

  this.set_wallpaper = function(image_url)
  {
    lobby.el.style.backgroundImage = "url("+image_url+")";
    this.log("Updated wallpaper.")
  }

  this.log = function(content)
  {
    this.logs.push(content);

    html = "";
    for(log_id in this.logs){
      html += "<ln class='half'><t class='f9'>"+lobby.commander.clock()+"</t> <t class=''>"+this.logs[log_id]+"</t></ln>\n";
    }
    this.wrapper_el.innerHTML += html;
  }

  this.log("Started");
}

lobby.install_callback("Util");