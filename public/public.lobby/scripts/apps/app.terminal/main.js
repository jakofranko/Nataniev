function Terminal()
{
	App.call(this);

  this.name = "terminal";
  this.size = {width:lobby.size.width,height:30};
  this.origin = {x:0,y:150};
  this.theme = "ghost";
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
      html += "<ln class='half ff'><t class='ff w2 di'> "+this.logs[log_id].time+"</t><t class='di w1 f9'>"+this.logs[log_id].glyph+"</t><t>"+this.logs[log_id].text+"</t></ln>\n";
    }

    while(this.logs.length > 20){
      this.logs.shift();
    }

    this.wrapper_el.innerHTML += html;
    this.resize_window_to(lobby.size.width - 60,this.logs.length * 15)
  }
}

lobby.install_callback("Terminal");
