function Oscean()
{
	App.call(this);

  this.name = "oscean";
  this.size = {width:300,height:300};
  this.origin = {x:-30,y:30};
  this.methods.find = {name:"find"};

  this.find = function(params)
  {
    this.call("find",params);
  }

  this.call_back = function(m,r)
  {
    var html = "";

    html += r.name+"/"+r.unde;

    if(r.photo){
      lobby.apps.util.set_wallpaper("http://localhost:8888/public.oscean/media/diary/"+r.photo+".jpg");
    }
    this.wrapper_el.innerHTML = html;
  }

  this.display_tasks = function(tasks)
  {
    html = "";

    var c = 0;
    for(field_id in tasks){
      if(!tasks[field_id]){ continue; }
      html += "<b>"+field_id+"</b>: "+tasks[field_id]+"<br />"
      c += 1;
    }
    this.wrapper_el.innerHTML = html;
    this.resize_window_to(240,c * 30);
  }
}

lobby.install_callback("Oscean");