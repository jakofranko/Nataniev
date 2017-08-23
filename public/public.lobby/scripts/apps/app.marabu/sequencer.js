function Sequencer(bpm)
{
  var app = lobby.apps.marabu;
  var target = this;

  this.follower = new Sequencer_Follower();
  this.edit_mode = false;
  this.selection = {x:0,y:0};
  this.sequence = {length:32,bpm:bpm}

  this.start = function()
  {
    console.log("Started Sequencer");
    this.refresh();
  }

  this.mod = function(mod)
  {
    var p = this.location().p+mod;

    if(p < 0){ p = 0; }
    if(p > 15){ p = 15; }

    this.edit_sequence(app.instrument.id,this.selection.y,p);
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
    if(c == NaN || !app.song.song().songData[i].c[c]){ return; }

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
    var p = app.song.song().songData[app.instrument.id].p[this.selection.y];
    return {i:app.instrument.id,s:this.selection.y,p:p};
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
    th.id = "location_name";
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
    document.getElementById("location_name").textContent = app.location_name().toUpperCase();

    var l = this.location();

    for (var r = 0; r < this.sequence.length; ++r)
    {
      for (var c = 0; c < 8; ++c)
      {
        var o = document.getElementById("sc" + c + "r" + r);
        var pat = app.song.song().songData[c].p[r];
        var classes = "";

        if (r == this.selection.y && c == this.selection.x){ classes += "selected "; }

        if(r > app.song.song().endPattern-2){ classes += "fl "; }
        else if(r == this.selection.y && c == this.selection.x && this.edit_mode){ classes += "fh "; }
        else{ classes += "fm "; }

        o.className = classes;

        if(pat){
          o.textContent = to_hex(pat);
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
      if(key == "]" || key == "}"){ target.mod(1); return; }
      if(key == "[" || key == "{"){ target.mod(-1); return; }

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
