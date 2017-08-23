function Sequencer(bpm)
{
  var app = lobby.apps.marabu;
  var target = this;

  this.follower = new Sequencer_Follower();
  this.sequence = {length:32,bpm:bpm}

  this.start = function()
  {
    console.log("Started Sequencer");
  }

  this.select = function(x = 0,y = 0)
  {
    app.selection.instrument = x;
    app.selection.track = y;

    app.update();
  }

  this.select_move = function(x,y)
  {
    app.selection.instrument += x;
    app.selection.track += y;

    app.update();
  }

  this.sequence_mouse_down = function(e)
  {
    var col = parseInt(e.target.id.slice(2,3));
    var row = parseInt(e.target.id.slice(4));

    target.select(col,row);
  }

  this.mod = function(mod)
  {
    var p = this.location().p+mod;

    if(p < 0){ p = 0; }
    if(p > 15){ p = 15; }

    this.edit_sequence(app.instrument.id,app.selection.track,p);
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

    app.editor.select(i,0,-1);
    app.editor.refresh();
  }

  this.location = function()
  {
    var p = app.song.song().songData[app.instrument.id].p[app.selection.track];
    return {i:app.instrument.id,s:app.selection.track,p:p};
  }

  // 
  // Sequence Table
  // 

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

  this.update = function()
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

        if (r == app.selection.track && c == app.selection.instrument){ classes += "selected "; }

        if(r > app.song.song().endPattern-2){ classes += "fl "; }
        else if(r == app.selection.track && c == app.selection.instrument && this.edit_mode){ classes += "fh "; }
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
      key = key.toLowerCase();
      
      if(key == "]" || key == "}"){ target.mod(1); return; }
      if(key == "[" || key == "{"){ target.mod(-1); return; }

      if(["0","1","2","3","4","5","6","7","8","9","escape","backspace","enter"].indexOf(key) == -1){ console.log("SEQ: Unknown Key",key); return; }
      
      if(key == "escape"){ return; }
      if(key == "backspace"){ key = 0; }

      var i = app.selection.instrument;
      var p = app.selection.track;

      if(key == "enter"){ target.edit_sequence(i,p,app.editor.pattern.id); return; }

      target.edit_sequence(i,p,key); 
      
    }
  }

}

lobby.apps.marabu.setup.confirm("sequencer");
