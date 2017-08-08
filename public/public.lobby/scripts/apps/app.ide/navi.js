lobby.apps.ide.navi = 
{
  update : function()
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

    var history_html = "";

    for(file_id in lobby.apps.ide.history){
      var file_path = lobby.apps.ide.history[file_id]
      var file_parts = file_path.split("/");
      var file_name = file_parts[file_parts.length-1];
      history_html += "<ln class='lh15 w6'>"+file_name+"</ln>";
    }

    html += "<yu class='ab'>"+history_html+"</yu>";

    lobby.apps.ide.navi_el.innerHTML = count == 0 ? "No Markers" : html;
  },
}

lobby.apps.ide.setup.confirm("navi");