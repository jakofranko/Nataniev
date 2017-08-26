lobby.apps.ide.navi = 
{
  marker_el : document.createElement("yu"),
  history_el : document.createElement("yu"),

  update : function()
  {
    this.update_history();
    this.update_markers();
  },

  parse : function(ext,line,line_id)
  {
    if(ext == "rb"){
      if(line.trim().split(" ")[0] == "def"){ return line.trim().split(" ")[1]; }
      if(line.trim().split(" ")[0] == "class"){ return line.trim().split(" ")[1]; }
    }
    if(ext == "js"){
      if(line.trim().split(" ")[0] == "function"){ return line.trim().split(" ")[1].split("(")[0]; }
    }
    if(ext == "mh"){
      if(line == line.toUpperCase().trim() && line.indexOf(" : ") == -1){ return line; }
    }
    if(ext == "ma"){
      if(line_id % 30 == 0){ return line.split(" ")[0]; }
    }
    return null;
  },

  update_markers : function()
  {
    // Build HTML
    lobby.apps.ide.markers_el.innerHTML = "";

    var lines = lobby.apps.ide.textarea_el.value.split("\n");
    var file_parts = lobby.apps.ide.location.split(".");
    var file_ext = file_parts[file_parts.length-1];

    var count = 0;
    var limit = (lobby.apps.ide.window.size.height/15) - lobby.apps.ide.history.length - 2;
    
    for(line_id in lines)
    {
      var should_parse = this.parse(file_ext,lines[line_id],line_id);
      if(!should_parse){ continue; }
      if(count > limit){ break; }
      var cmd_el = lobby.commander.create_cmd(should_parse.substr(0,20)+"<t class='ar'>"+line_id+"</t>","ide.goto "+line_id,"lh15 db cu fl");
      lobby.apps.ide.markers_el.appendChild(cmd_el);
      count += 1;
    }
  },

  update_history : function()
  {
    // Remove duplicates
    var updated_history = [];
    for(file_id in lobby.apps.ide.history){
      if(updated_history.indexOf(lobby.apps.ide.history[file_id]) > -1){ continue; }
      updated_history.push(lobby.apps.ide.history[file_id]);
    }
    lobby.apps.ide.history = updated_history;

    // Build HTML
    lobby.apps.ide.history_el.innerHTML = "";

    var html = "";

    var count = 0;
    for(file_id in lobby.apps.ide.history){
      if(count > 10){ break; }
      var file_path = lobby.apps.ide.history[file_id]
      var file_parts = file_path.split("/");
      var file_name = file_parts[file_parts.length-1];
      var cmd_el = lobby.commander.create_cmd(file_name,"ide.load "+file_path,"lh15 db cu fl");
      lobby.apps.ide.history_el.appendChild(cmd_el);
      count += 1;
    }
  }
}

lobby.apps.ide.setup.confirm("navi");