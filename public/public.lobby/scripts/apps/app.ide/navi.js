lobby.apps.ide.navi = 
{
  marker_el : document.createElement("yu"),
  history_el : document.createElement("yu"),

  update : function()
  {
    this.update_history();
    this.update_markers();
  },

  markers : function()
  {
    var lines = lobby.apps.ide.textarea_el.value.split("\n");
    var html = "";

    var count = 0
    for(line_id in lines)
    {
      if(count > 30){ break; }
      var line = lines[line_id];
      var marker = line.trim().split(" ")[0];
      var targets_major = ["class","module"];
      var targets_minor = ["def","attr_accessor","function"];
      var targets_miscs = ["private"];
      if(targets_major.indexOf(marker) > -1){
        var name = line.replace(marker,"").trim().split(" ")[0].substr(0,14);
        html += "<ln class='rel block'>"+name+" <t class='ar'>"+line_id+"</t></ln>";
        count += 1;
      }
      if(targets_minor.indexOf(marker) > -1){
        var name = line.replace(marker,"").trim().split(" ")[0].substr(0,14);
        html += "<ln class='f9 rel block'>"+name+" <t class='ar'>"+line_id+"</t></ln>";
        count += 1;
      }
      if(targets_miscs.indexOf(marker) > -1){
        var name = line.trim().split(" ")[0].substr(0,14);
        html += "<ln class='f5 rel block'>"+name+" <t class='ar'>"+line_id+"</t></ln>";
        count += 1;
      }
    }
    return html;

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

    for(file_id in lobby.apps.ide.history){
      var file_path = lobby.apps.ide.history[file_id]
      var file_parts = file_path.split("/");
      var file_name = file_parts[file_parts.length-1];
      var cmd_el = lobby.commander.create_cmd(file_name,"ide.load "+file_path,"lh15 db cu fl");
      lobby.apps.ide.history_el.appendChild(cmd_el);
    }
  }
}

lobby.apps.ide.setup.confirm("navi");