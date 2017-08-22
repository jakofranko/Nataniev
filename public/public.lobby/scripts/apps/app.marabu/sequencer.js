function Sequencer(bpm)
{
  var app = lobby.apps.marabu;
  var target = this;

  this.edit_mode = false;
  this.selection = {x:0,y:0};
  this.sequence = {length:32,bpm:bpm}

  this.title_el = document.getElementById("seq_title");
  this.bpm_el = document.getElementById("bpm");

  this.build = function()
  {
    var html = "";

    html += "  <div class='sequencer' id='sequence_controller' style='width:105px; display:inline-block; vertical-align:top'>";
    html += "    <h1 class='lh30 hide' style='width:90px'><b id='seq_title'>SEQ</b> <t id='bpm' class='bh fm' style='float:right; text-align:right; height:30px; line-height:30px; background:transparent'/><hr /></h1>";
    html += "    <div id='sequencer'><table class='tracks' id='sequencer-table'></table></div>";
    html += "  </div>";

    return html;
  }

  this.calc_time = function()
  {
    return "4:35";
  }

  this.pattern_id_at = function(x,y)
  {
    var instrument_id = app.song.instrument_controller.id;
    var pattern_id = app.song.song().songData[instrument_id].p[this.selection.y];
    return pattern_id - 1;
  }

  this.select = function(x = 0,y = 0)
  {
    this.selection = {x:x,y:y};

    var target_pattern_value = document.getElementById("sc"+x+"r"+y).textContent;
    var target_instrument_id = x;
    var target_pattern_id = target_pattern_value == "-" ? -1 : parseInt(target_pattern_value);    

    app.editor.pattern.id = target_pattern_id;
    app.instrument.id = target_instrument_id;

    app.editor.refresh();
    app.sequencer.refresh();
    app.instrument.refresh();

    console.log(app.sequencer.location());
  }

  this.deselect = function()
  {
    this.selection = {x:-1,y:-1};
    app.sequencer.refresh();
  }

  this.select_move = function(x,y)
  {
    var s = this.selection;

    s.x += x;
    s.y += y;

    if(s.x < 0){ s.x = 0; }
    if(s.y < 0){ s.y = 0; }
    if(s.x > 7){ s.x = 7; }
    if(s.y > 31){ s.y = 31; }

    this.select(s.x,s.y);
  }

  this.edit = function(toggle = true)
  {
    console.log("sequencer.edit",toggle);
    this.edit_mode = toggle;

    var table = document.getElementById("sequencer-table");
    table.className = toggle ? "tracks edit" : "tracks";
  }

  this.edit_note = function(i,c,n,v)
  {
    if(c == NaN || !app.song.song().songData[i].c[c]){ console.warn("error"); return; }

    app.song.song().songData[i].c[c].n[n] = v;
  }

  this.edit_effect = function(i,c,f,cmd = 0,val = 0)
  {
    app.song.song().songData[i].c[c].f[f] = cmd;
    app.song.song().songData[i].c[c].f[f+32] = val;
  }

  this.edit_sequence = function(i,p,v)
  {
    app.song.song().songData[i].p[p] = parseInt(v);
    app.song.update_ranges();

    console.info("edit_sequence","i:"+i,"p:"+p,"v:"+v,app.song.song().songData);

    this.refresh_table();
    app.editor.select(i,0,-1);
    app.editor.refresh();
  }

  this.location = function()
  {
    return {i:app.instrument.id,s:this.selection.y};
  }

  // 
  // Sequence Table
  // 

  this.sequence_mouse_down = function(e)
  {
    var col = parseInt(e.target.id.slice(2,3));
    var row = parseInt(e.target.id.slice(4));

    app.editor.edit(false);
    target.edit();
    target.select(col,row,col,row);
    lobby.commander.update_status();
  }

  this.refresh = function()
  {
    this.refresh_table();
    this.refresh_title();
  }

  this.refresh_title = function()
  {
    var html = "SEQ ";

    if(this.edit_mode){ html += this.selection.y; }

    document.getElementById("seq_title").innerHTML = html;
    document.getElementById("bpm").innerHTML = this.sequence.bpm;
  }

  this.build_sequence_table = function()
  {
    var table = document.getElementById("sequencer-table");
    // Clean
    while (table.firstChild){
      table.removeChild(table.firstChild);
    }
    // Head
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.colSpan = 8;
    th.className = "lh30 bold";
    th.textContent = "SEQ";
    tr.appendChild(th);
    table.appendChild(tr);
    // Main
    var tr, td;
    for (var row = 0; row < this.sequence.length; row++) {
      tr = document.createElement("tr");
      tr.id = "spr"+row;
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
    var l = this.location();

    for (var r = 0; r < this.sequence.length; ++r)
    {
      for (var c = 0; c < 8; ++c)
      {
        var o = document.getElementById("sc" + c + "r" + r);
        var pat = app.song.song().songData[c].p[r];
        var classes = "";
        if(pat > 0){ classes += "pattern_"+pat+" "; }
        if (r == this.selection.y && c == this.selection.x){ classes += "selected "; }

        if(r > app.song.song().endPattern-2){ classes += "fl "; }
        else if(r == this.selection.y && c == this.selection.x && this.edit_mode){ classes += "fh "; }
        else{ classes += "fm "; }

        o.className = classes;

        if(pat){
          o.textContent = pat;  
        }
        else if(r > app.song.song().endPattern-2){ 
          o.textContent = ".";  
        }
        else{
          o.textContent = "-";  
        }
      }
    }
  }

  // Keyboard Events

  this.when = 
  {
    key : function(key)
    {
      if(target.edit_mode != true){ return; }
      key = key.toLowerCase();

      if(key == "arrowleft"){ target.select_move(-1,0); return; }
      if(key == "arrowright"){ target.select_move(1,0); return; }
      if(key == "arrowup"){ target.select_move(0,-1); return; }
      if(key == "arrowdown"){ target.select_move(0,1); return; }

      if(["0","1","2","3","4","5","6","7","8","9","escape","backspace","enter"].indexOf(key) == -1){ console.log("SEQ: Unknown Key",key); return; }
      
      if(key == "escape"){ return; }
      if(key == "backspace"){ key = 0; }

      var i = target.selection.x;
      var p = target.selection.y;

      if(key == "enter"){ target.edit_sequence(i,p,app.editor.pattern.id); return; }

      target.edit_sequence(i,p,key); 
      
    }
  }

}

lobby.apps.marabu.setup.confirm("sequencer");
