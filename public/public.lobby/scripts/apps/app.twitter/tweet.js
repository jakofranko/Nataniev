function Tweet(t)
{
	this.t         = t;
  this.id        = t.id;
  this.user_name = t.user_name;
  this.user_id   = t.user_id;
  this.time      = t.timestamp;
  this.text      = t.text;
  this.rt_count  = t.retweet_count;

  this.el        = document.createElement("ln"); 

  this.is_retweet = function()
  {
    if(this.text.substr(0,2) == "RT"){
      return this.text.split(": ")[0].split("RT ")[1];
    }
    return null;
  }

  this.is_reply = function()
  {
    if(this.text.substr(0,1) == "@"){
      return this.text.split(" ")[0];
    }
    return null;
  }

  this.time_ago = function(time_entry)
  {
    var time_now = Math.floor(Date.now() / 1000);
    var time_diff = parseInt((time_now - time_entry)/60); 

    if(time_diff > 1440){ return parseInt(time_diff/1440)+"d ago"; }
    if(time_diff > 60){ return parseInt(time_diff/60)+"h ago"; }
    return time_diff+"m ago"
  }

  this.text_edit = function(strip)
  {
    var words = this.text.replace(strip,"").trim().split(" ")
    var html = "";

    for(word_id in words){
      var word = words[word_id].trim();

      if(word.substr(0,1)=="@"){
        html += "<span class='fu'>"+word+"</span> ";
      }
      else if(word.substr(0,1)=="#"){
        html += "<span class='bc ff ib'>"+word+"</span> "; 
      }
      else if(word.substr(0,4)=="http"){
        html += "<a class='b0 ff ib' href='"+word+"'>Link</a> "; 
      }
      else{
        html += word+" ";
      }
    }

    // Highlights
    var dict = lobby.apps.twitter.filter.highlight;
    for(word_id in dict){
      html = html.replace(dict[word_id],"<span class='highlight'>"+dict[word_id]+"</span>");
    }

    return html;
  }

  this.template_reply = function()
  {
    this.el.className = "half mb ";
    return "<b class='ib'>@"+this.user_name+"</b> > <b class='ib'>"+this.is_reply()+"</b> <i>"+this.time_ago(this.time)+"</i><br /> <t>"+this.text_edit(this.is_reply())+" "+this.rt_count+"RT</t>";
  }

  this.template_retweet = function()
  {
    this.el.className = "half mb";
    return "<b class='ib'>@"+this.user_name+"</b>(<b class='ib'>"+this.is_retweet()+"</b>) <i>"+this.time_ago(this.time)+"</i><br /> <t class='f9'>"+this.text_edit("RT "+this.is_retweet()+":")+" "+this.rt_count+"RT</t>";
  }

  this.template_default = function()
  {
    this.el.className = "half mb ";
    return "<b class='ib'>@"+this.user_name+"</b> <i>"+this.time_ago(this.time)+"</i><br /> <t>"+this.text_edit()+" "+this.rt_count+"RT</t>";
  }

  this.find_accounts = function()
  {
    var words = this.text.split(" ");
    var s = "";

    for(word_id in words){
      var word = words[word_id].trim();
      if(word.substr(0,1)=="@"){
        s += word+" ";
      }
    }
    return s;
  }

  this.mouse_up = function()
  {
    lobby.commander.inject("twitter.reply "+this.getAttribute("data-tweet_id")+" @"+this.getAttribute("data-user_name")+" "+this.getAttribute("data-accounts"));
    lobby.commander.input_el.focus();
  }

  this.el.setAttribute("data-user_name",this.user_name);
  this.el.setAttribute("data-accounts",this.find_accounts());
  this.el.setAttribute("data-tweet_id",this.id);

  this.el.addEventListener("mouseup", this.mouse_up, false);

  if(this.is_reply()){ this.el.innerHTML = this.template_reply(); }
  else if(this.is_retweet()){ this.el.innerHTML = this.template_retweet(); }
  else{ this.el.innerHTML = this.template_default(); }
}
