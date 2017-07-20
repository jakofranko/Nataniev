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

  this.browser_el = document.createElement("yu"); this.browser_el.className = "full";

  this.textarea_el = document.createElement("textarea"); this.textarea_el.className = "full";
  this.textarea_el.style.display = "none";
  this.wrapper_el.appendChild(this.textarea_el);
  this.wrapper_el.appendChild(this.browser_el);

  this.textarea_el.setAttribute("autocomplete","off")
  this.textarea_el.setAttribute("autocorrect","off")
  this.textarea_el.setAttribute("autocapitalize","off")
  this.textarea_el.setAttribute("spellcheck","false")
  this.textarea_el.setAttribute("type","text")

  this.location = "";

  this.on_input_change = function(value)
  {
    var targets = value.trim().split(" "); targets.shift();
    var candidates = this.candidates_from_string(targets);

    var html = "";
    if(candidates.length < 1){
      html += "No candidates found."
    }
    else{
      for(candidate_id in candidates){
        html += "<ln class='lh15 "+(candidate_id == candidates.length-1 ? 'bf f0' : 'ff')+"'>"+candidates[candidate_id]+'</ln>';
      }  
      var target_height = (candidates.length * 15)+60;
      this.resize_window_to(420,target_height > 300 ? 300 : target_height)
    }
    this.browser_el.innerHTML = html;

    this.textarea_el.style.display = "none";
    this.browser_el.style.display = "block";
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
    this.call("list",(this.location).replace(/\//g, '-'));
  }

  this.load = function(value)
  {
    var targets = value.trim().split(" ");
    var candidates = this.candidates_from_string(targets);
    var target = candidates[candidates.length-1];

    this.location += target;
    this.call("load_file",(this.location).replace(/\//g, '-'));
  }

  this.call_back = function(m,r)
  {
    if(m == "list"){ this.callback_list(r); }
    if(m == "load_file"){ this.callback_load(r); }
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
    this.textarea_el.value = r[0].payload;
    this.textarea_el.style.display = "block";
    this.browser_el.style.display = "none";
    this.resize_window_to(690,lobby.size.height-60);
    this.move_window_to(270,0);
  }

  this.candidates_from_string = function(targets)
  {
    var candidates = [];
    for(file_id in this.tree){
      var file_name = this.tree[file_id];

      var found = 0;
      for(target_id in targets){
        var target = targets[target_id];
        if(file_name.indexOf(target) > -1){ found += 1; }
      } 
      if(found == targets.length){
        candidates.push(file_name);   
      }
    }
    return candidates;
  }
}

lobby.install_callback("Editor");