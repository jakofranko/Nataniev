function Sequencer()
{
  var app = lobby.apps.marabu;
  var target = this;

  this.edit_mode = false;
  this.selection = {x1:0,y1:0,x2:0,y2:0};
  this.sequence = {length:32}

  this.bpm_el = document.getElementById("bpm");

  this.status = function()
  {
    var html = "";
    html += "SEQ("+this.selection.x1+":"+this.selection.y1+" "+this.selection.x2+":"+this.selection.y2+") ";
    return html;
  }

  this.build = function()
  {
    var html = "";

    html += "  <div class='sequencer' id='sequence_controller' style='width:120px; display:inline-block; vertical-align:top'>";
    html += "    <h1 class='lh30'><b>SEQ</b> <input id='bpm' type='text' size='3' value='' title='Beats per minute (song speed)' class='bh fh'/></h1>";
    html += "    <div id='sequencer'><table class='tracks' id='sequencer-table'></table></div>";
    html += "  </div>";

    return html;
  }

  this.pattern_id_at = function(x,y)
  {
    var instrument_id = GUI.instrument_controller.id;
    var pattern_id = GUI.song().songData[instrument_id].p[this.selection.y1];
    return pattern_id - 1;
  }

  this.select = function(x1 = 0,y1 = 0,x2 = 0,y2 = 0)
  {
    this.selection = {x1:x1,y1:y1,x2:x2,y2};

    var target_pattern_value = document.getElementById("sc"+x2+"r"+y2).textContent;
    var target_instrument_id = x2;
    var target_pattern_id = target_pattern_value == "-" ? -1 : parseInt(target_pattern_value);    

    app.editor.pattern.id = target_pattern_id;
    app.instrument.id = target_instrument_id;

    app.sequencer.refresh();
    app.editor.refresh();
    app.instrument.refresh();
  }

  this.deselect = function()
  {
    this.selection = {x1:-1,y1:-1,x2:-1,y2:-1};
  }

  this.edit = function(toggle = true)
  {
    app.editor.edit_mode = false;
    app.instrument.edit_mode = false;

    this.edit_mode = toggle;

    var table = document.getElementById("sequencer-table");
    table.className = toggle ? "tracks edit" : "tracks";
  }

  this.edit_note = function(i,c,n,v)
  {
    console.info("edit_node","i:"+i,"c:"+c,"n:"+n,"v:"+v,GUI.song().songData);
    GUI.song().songData[i].c[c].n[n] = v;

    console.info("edit_node","i:"+i,"c:"+c,"n:"+n,"v:"+v,GUI.song().songData);
  }

  this.edit_sequence = function(i,p,v)
  {
    var i = this.selection.x2;
    var p = this.selection.y2;

    GUI.song().songData[i].p[p] = parseInt(v);

    console.info("edit_sequence","i:"+i,"p:"+p,"v:"+v,GUI.song().songData);

    this.refresh_table();
    this.edit(false);
    if(v != 0){
      app.editor.pattern.id = parseInt(v);
      app.editor.edit();      
    }
  }

  this.play = function()
  {
    console.log("play!");
    GUI.play_song();
  }

  function bpm_update(e)
  {
    // if(GUI.sequence_controller.bpm_el.value == ""){ return; }
    // var new_bpm = parseInt(GUI.sequence_controller.bpm_el.value);
    // if(new_bpm < 20){ new_bpm = 10; }
    // if(new_bpm > 800){ new_bpm = 800;}
    // GUI.update_bpm(new_bpm);
  }

  this.location = function()
  {
    return {i:app.instrument.id};
  }

  // 
  // Sequence Table
  // 

  this.sequence_mouse_down = function(e)
  {
    var col = parseInt(e.target.id.slice(2,3));
    var row = parseInt(e.target.id.slice(4));

    target.edit();
    target.select(col,row,col,row);
    lobby.commander.update_status();
  }

  this.refresh = function()
  {
    this.refresh_table();
  }

  this.build_sequence_table = function()
  {
    var table = document.getElementById("sequencer-table");
    // Clean
    while (table.firstChild){
      table.removeChild(table.firstChild);
    }
    var tr, td;
    for (var row = 0; row < this.sequence.length; row++) {
      tr = document.createElement("tr");
      tr.className = row % 4 === 0 ? "beat" : "";
      for (var col = 0; col < 8; col++) {
        td = document.createElement("td");
        td.id = "sc" + col + "r" + row;
        td.textContent = "-";
        td.addEventListener("mousedown", this.sequence_mouse_down, false);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
  }

  this.refresh_table = function()
  {
    for (var r = 0; r < this.sequence.length; ++r)
    {
      for (var c = 0; c < 8; ++c)
      {
        var o = document.getElementById("sc" + c + "r" + r);
        var pat = GUI.song().songData[c].p[r];
        var classes = "";
        if(pat > 0){ classes += "pattern_"+pat+" "; }
        if (r >= this.selection.y1 && r <= this.selection.y2 && c >= this.selection.x1 && c <= this.selection.x2){ classes += "selected "; }
        o.className = classes;
        o.textContent = pat ? pat : "-";
      }
    }
  }

  // Keyboard Events

  this.when = 
  {
    key : function(key)
    {
      if(key == "escape"){ target.edit(false); }
      if(!target.edit_mode){ return; }

      if(["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","escape","backspace"].indexOf(key) == -1){ console.log("SEQ: Unknown Key",key); return; }
      
      if(key == "backspace"){ key = 0; }

      var i = target.selection.x2;
      var p = target.selection.y2;
      target.edit_sequence(i,p,key); 
      
    }
  }

}

lobby.apps.marabu.setup.confirm("sequencer");
