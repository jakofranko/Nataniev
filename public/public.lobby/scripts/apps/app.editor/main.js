function Editor()
{
	App.call(this);

  this.name = "editor";
  this.size = {width:420,height:420};
  this.origin = {x:120,y:120};
  this.theme = "noir";
  this.methods.new = {name:"new"};
  this.methods.load = {name:"load"};
  this.methods.list = {name:"list"};

  this.tree = null;

  this.search_el = document.createElement("input"); 
  this.search_el.className = "db lh30 b_ ff sb w7";
  this.search_el.addEventListener('input', input_change, false);

  this.textarea_el = document.createElement("textarea"); this.textarea_el.className = "full";
  this.wrapper_el.appendChild(this.search_el);
  this.wrapper_el.appendChild(this.textarea_el);

  this.textarea_el.setAttribute("autocomplete","off")
  this.textarea_el.setAttribute("autocorrect","off")
  this.textarea_el.setAttribute("autocapitalize","off")
  this.textarea_el.setAttribute("spellcheck","false")
  this.textarea_el.setAttribute("type","text")

  this.search_el.value = "/"

  this.location = "";

  function input_change()
  {
    var app = lobby.apps.editor;
    var target = app.search_el.value;

    var candidates = [];
    for(file_id in app.tree){
      var file_name = app.tree[file_id];
      if(file_name.indexOf(target) > -1 ){ candidates.push(file_name); }
    }

    var html = "";
    for(candidate_id in candidates){
      html += candidates[candidate_id]+'\n';
    } 
    app.textarea_el.value = html;
    app.resize_window_to(420,(candidates.length * 15)+60)
  }

  this.on_launch = function()
  {
    this.update_tree();
  }

  this.update_tree = function()
  {
    this.call("get_tree");
  }

  this.list = function(p)
  {
    if(!p){ this.location = ""; }
    this.location += p+"/";
    this.search_el.innerHTML = this.location;
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
    if(m == "get_tree"){ this.callback_tree(r); }
  }

  this.callback_tree = function(r)
  {
    this.tree = r[0].payload;

    var html = "";
    for(file_id in this.tree){
      html += this.tree[file_id]+"\n";
    }
    this.textarea_el.value = html;
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
  }
}

lobby.install_callback("Editor");