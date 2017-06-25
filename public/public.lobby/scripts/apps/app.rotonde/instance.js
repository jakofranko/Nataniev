function Rotonde_Instance(domain,data)
{
  this.domain = domain;
  this.data = data;

  this.el = document.createElement("ln");
  this.el.className = "half mb";

  this.init = function()
  {
    this.el.innerHTML = "Aquiring "+this.domain+" feed..";
    this.aquire("http://"+this.domain);
  }

  this.aquire = function(url)
  {
    var app = this;

    $.get(url, function(response){

      if(typeof response == "object"){
        return app.aquire_callback(response);
      }
      else if(typeof response == "string"){
        var a = JSON.parse(response);
        return app.aquire_callback(a);
      }
      else{
        this.el.innerHTML = "Error aquiring "+this.domain+" feed.";
      }
    }); 
  }

  this.aquire_callback = function(r)
  {
    this.data = r;
    this.update();
  }

  this.last_update = function()
  {
    return parseInt(this.data.feed[0].time);
  }

  this.time_ago = function(time_entry)
  {
    var time_now = Math.floor(Date.now() / 1000);
    var time_diff = parseInt((time_now - time_entry)/60); 

    if(time_diff > 1440){ return parseInt(time_diff/1440)+"d ago"; }
    if(time_diff > 60){ return parseInt(time_diff/60)+"h ago"; }
    return time_diff+"m ago"
  }

  this.update = function()
  {
    var html = "";

    var time_now = Math.floor(Date.now() / 1000);
    var time_entry = parseInt(this.data.feed[0].time);
    var time_ago = parseInt((time_now - time_entry)/60);

    html += this.get_entry();
    html += "<b>~"+this.data.profile.name+"</b>@"+this.domain+" <span style='color:#999'>from "+this.data.profile.location+"</span><br />";

    this.el.innerHTML = html;
  }

  this.get_entry = function()
  {
    var html = "";
    var count = 0;

    var most_recent = null;

    for(log_id in this.data.feed){
      var log = this.data.feed[log_id];      
      if(!most_recent){ most_recent = log; }
      most_recent = parseInt(log.time) > most_recent.time ? log : most_recent;
    }

    html += most_recent.text;
    html += most_recent.url ? " <a href='"+most_recent.url+"' class='b0 ff ib'>LINK</a>" : "";
    html += most_recent.media ? " <a href='"+most_recent.media+"' class='b0 f9 ib'>MEDIA</a>" : "";
    html += " <span style='color:#999'>"+this.time_ago(most_recent.time)+"</span><br />";
    return html;
  }
}