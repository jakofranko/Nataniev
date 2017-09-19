function Rotonde_Portal(address)
{
  var target = this;

  this.address = address;

  this.el = document.createElement("ln");
  this.el.className = "lh15 mb15 pdl15";

  this.log_el = document.createElement("t");
  this.profile_el = document.createElement("ln");
  this.profile_el.className = "fm";

  this.last_update = null;

  this.install = function(target_el)
  {
    this.log_el.innerHTML = "Aquiring "+this.address+"..";

    this.el.appendChild(this.log_el);
    this.el.appendChild(this.profile_el);

    target_el.appendChild(this.el);

    this.aquire();
  }

  this.aquire = function()
  {
    var answerer = this;
    var url = this.address;
    // url = "http://localhost:8888"; // Testing

    try {
      $.get(url, function(response){
        answerer.parse(response);
      });   
    } catch(e) {
      console.log("Failed to aquire feed");
    }
  }

  this.parse = function(response)
  {
    console.log("response",response);
    try {
      this.data = (typeof response == "object") ? response : JSON.parse(response);
      this.refresh();
    } catch(e){
      console.log("Invalid JSON",data);
    }
  }

  this.refresh = function()
  {
    this.log_el.innerHTML = this.get_entry();
    this.profile_el.innerHTML = "<b>"+this.data.profile.name+"</b>@"+this.address.split("//")[1]+" <t style='color:"+this.data.profile.color+"'>●</t> <span class='fm'>from "+this.data.profile.location+"</span> <t class='fl'>"+this.last_update+"</t>";
  }

  this.time_ago = function(time_entry)
  {
    var time_now = Math.floor(Date.now() / 1000);
    var time_diff = parseInt((time_now - time_entry)/60); 

    if(time_diff > 1440){ return parseInt(time_diff/1440)+"d ago"; }
    if(time_diff > 60){ return parseInt(time_diff/60)+"h ago"; }
    return time_diff+"m ago"
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

    this.last_update = this.time_ago(most_recent.time);

    html += most_recent.text+" ";
    html += most_recent.url ? " <a href='"+most_recent.url+"' class='bold'>+link</a> " : "";
    html += most_recent.media ? " <a href='"+most_recent.media+"' class='bold fu'>+media</a> " : "";
    html += most_recent.data && most_recent.data.topic ? "<t class='fm'>#"+most_recent.data.topic+"</t>" : "";
    return html;
  }
}

lobby.apps.rotonde.setup.confirm("portal");

