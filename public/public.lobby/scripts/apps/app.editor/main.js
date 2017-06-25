function Editor()
{
	App.call(this);

  this.name = "editor";
  this.size = {width:690,height:0};
  this.origin = {x:120,y:120};
  this.theme = "noir";
  this.methods.new = {name:"new"};
  this.methods.load = {name:"load"};
  this.methods.list = {name:"list"};

  this.file_status_el = document.createElement("hl"); 
  this.textarea_el = document.createElement("textarea"); this.textarea_el.className = "full";
  this.wrapper_el.appendChild(this.file_status_el);
  this.wrapper_el.appendChild(this.textarea_el);

  this.textarea_el.setAttribute("autocomplete","off")
  this.textarea_el.setAttribute("autocorrect","off")
  this.textarea_el.setAttribute("autocapitalize","off")
  this.textarea_el.setAttribute("spellcheck","false")
  this.textarea_el.setAttribute("type","text")

  this.file_status_el.innerHTML = "disk/apps/app.util/main.js"

  this.location = "";

  this.on_launch = function()
  {
    this.list("");
  }

  this.list = function(p)
  {
    if(!p){ this.location = ""; }
    this.location += p+"/";
    this.file_status_el.innerHTML = this.location;
    this.call("list",(this.location).replace(/\//g, '-'));
  }

  this.load = function(p)
  {
    this.location += p;
    this.call("load",(this.location).replace(/\//g, '-'));
  }

  this.call_back = function(m,r)
  {
    if(m == "list"){ this.callback_list(r); }
    if(m == "load"){ this.callback_load(r); }
  }

  this.callback_list = function(r)
  {
    html = "";
    for(file_id in r){
      html += r[file_id]+"\n";
    }
    this.textarea_el.value = html;
    this.resize_window_to(this.size.width,(r.length * 15) + 90);
  }

  this.callback_load = function(r)
  {
    var html = "";
    for(line_id in r.lines){
      var line = r.lines[line_id];
      html += line;
    }
    this.textarea_el.value = html;
    this.resize_window_to(this.size.width,(30 * 15));

  }
}

lobby.install_callback("Editor");