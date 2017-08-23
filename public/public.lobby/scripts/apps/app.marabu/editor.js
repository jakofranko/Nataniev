function Editor(t,b)
{
  var app = lobby.apps.marabu;
  var target = this;

  this.edit_mode = false;
  this.selection = {x:0,y:0,e:-1};
  this.pattern = {id:0,beat:4,length:(t*b),signature:[t,b],effect:-1};

  this.signature_el = document.getElementById("signature");

  this.start = function()
  {
    console.log("Started Editor");

    var table = document.getElementById("pattern-table");
    var tr = document.createElement("tr");
    // Names
    for (var i = 0; i < 8; i++) {
      var th = document.createElement("th");
      th.id = "ih"+i;
      th.className = "lh30 bold";
      th.textContent = "????";
      tr.appendChild(th);
    }
    table.appendChild(tr);
    var tr, td;
    for(var r = 0; r < 32; r++) {
      tr = document.createElement("tr");
      tr.id = "ppr"+r;
      tr.className = r % this.pattern.signature[1] == 0 ? " fm" : "";
      // Notes
      for (i = 0; i < 8; i++) {
        td = document.createElement("td");
        td.id = "i"+i+"r"+r;
        td.textContent = "----";
        td.addEventListener("mousedown", this.pattern_mouse_down, false);
        tr.appendChild(td);
      }
      // Effects
      var th = document.createElement("th");
      th.id = "fxr" + r;
      th.textContent = "0000";
      th.addEventListener("mousedown", this.effect_mouse_down, false);
      tr.appendChild(th);
      // End
      table.appendChild(tr);
    }
  }

  this.load = function(pattern_id = 0)
  {
    this.select(0,0,-1);

    document.getElementById("pattern-table").className = pattern_id == -1 ? "tracks inactive" : "tracks";
  }

  this.select = function(x = 0,y = 0,e = -1)
  {
    app.instrument.select(null);
    this.selection.x = x;
    this.selection.y = y;
    this.selection.e = e;

    if(e == -1){ app.instrument.id = x; }
    else if(e >= 0 && this.location().p == 0){ this.selection.e = -1; }

    app.selection.instrument = x;
  }

  this.deselect = function()
  {
    this.select(-1,-1,-1);
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
    console.log("editor.edit",toggle);
    this.edit_mode = toggle;

    var table = document.getElementById("pattern-table");
    table.className = toggle ? "tracks edit" : "tracks";
  }

  this.inject = function(v,left_hand)
  {
    return;
    var l = this.location();

    // Erase
    if(v == 0){
      console.log("Erase notes");
      app.sequencer.edit_note(l.i,l.p-1,l.n,0);
      app.sequencer.edit_note(l.i,l.p-1,l.n+32,0);
      app.sequencer.edit_effect(l.i,l.p-1,l.n,0,0);
      app.sequencer.edit_effect(l.i,l.p-1,l.n+32,0,0);
    }
    else if(!left_hand){
      app.sequencer.edit_note(l.i,l.p-1,l.n+32,v + (app.instrument.octave * 12));  
    }
    else{
      app.sequencer.edit_note(l.i,l.p-1,l.n,v + (app.instrument.octave * 12));  
    }
    lobby.commander.update_status();
  }

  this.location = function()
  {
    // Get pattern
    var sequence = app.active().pattern;
    var pattern_id = app.song.instrument().p[sequence];
    var note = this.selection.y;
    var note_val = pattern_id > 0 ? app.song.instrument().c[pattern_id-1].n[note] : null;

    return {i:app.instrument.id,p:pattern_id,n:note,note:note_val};
  }

  this.pattern_mouse_down = function(e)
  {
    var i = parseInt(e.target.id.slice(1,2));
    var r = parseInt(e.target.id.slice(3));

    target.select(i,r);
    target.edit();
    app.sequencer.edit(false);
  }

  this.effect_mouse_down = function(e)
  {
    var row = parseInt(e.target.id.slice(3,5));
    target.select(target.selection.x,row,row);
  }

  this.mod = function(mod)
  {
    if(this.selection.e >= 0){ return; }
    lobby.commander.notify("MOD "+(mod > 0 ? "+"+mod : mod));
    var l = this.location();
    app.sequencer.edit_note(l.i,l.p-1,l.n,l.note+mod);
  }

  this.set_effect = function(cmd,val)
  {
    var l = this.location();
    var r = this.selection.e;

    // console.log(cmd,val,app.song)

    if(this.selection.e < 0 || !app.song.instrument().c[l.p-1]){ return; }

    app.song.instrument().c[l.p-1].f[r] = cmd+1;
    app.song.instrument().c[l.p-1].f[r+32] = val;  
  }

  function parse_note(val)
  {
    // val -= 87;
    var notes = ['C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#', 'A-', 'A#', 'B-'];
    var octave = Math.floor((val)/12);
    var key = notes[(val) % 12];
    var key_sharp = key.substr(1,1) == "#" ? true : false;
    var key_note = key.substr(0,1);
    return {octave:octave,sharp:key_sharp,note:key_note};
  }

  this.update = function()
  {
    var l = this.location();

    document.getElementById("pattern-table").className = l.p == -1 ? "tracks inactive" : "tracks";

    // 32 x 8
    for(var i = 0; i < 8; i++){
      var sequence = app.song.song().songData[i].p[app.selection.instrument];

      // Header
      var instrument_header = document.getElementById("ih"+i);
      instrument_header.textContent = app.song.instrument(i).name ? app.song.instrument(i).name.substr(0,4).toUpperCase() : "????";
      instrument_header.className = app.song.pattern_at(i,app.selection.track) ? "lh30 fm" : "lh30 fl";
      if(app.selection.instrument == i){ instrument_header.className = "lh30 fh"; }

      // Each Row
      for(var r = 0; r < 32; r++){
        var row_el = document.getElementById("ppr"+r);
        var cell = document.getElementById("i"+i+"r"+r);
        var left_note = app.song.note_at(i,app.selection.track,r);
        var right_note = app.song.note_at(i,app.selection.track,r+32);
        var effect_cmd = app.song.effect_at(i,app.selection.track,r);

        var left_string = "--";
        var right_string = effect_cmd ? to_hex(effect_cmd,2) : "--";

        if(left_note > 0){
          var n = parse_note(left_note); 
          left_string = (n.sharp ? n.note.toLowerCase() : n.note)+""+n.octave;
        }
        if(right_note > 0){
          var n = parse_note(right_note);
          right_string = (n.sharp ? n.note.toLowerCase() : n.note)+""+n.octave;
        }

        cell.textContent = left_string+right_string;

        if(effect_cmd){ cell.className = "bi fi "; }
        else if(i == app.selection.instrument && r == app.selection.row){ cell.className = "fh"; }
        else{ cell.className = ""; }
      }
    }

    // 32
    for (var r = 0; r < 32; ++r)
    {
      var classes = "";
      var o_f = document.getElementById("fxr"+r);
      if(r == this.selection.e){ classes += "fh "; }
      if(r % this.pattern.signature[1] == 0){ classes += "fm "; }

      if(app.song.instrument().c[l.p]){
        var f_cmd = app.song.instrument().c[l.p-1] ? app.song.instrument().c[l.p-1].f[r] : 0;
        var f_val = app.song.instrument().c[l.p-1] ? app.song.instrument().c[l.p-1].f[r+this.pattern.length] : 0;
        o_f.textContent = (r == this.selection.e) ? "> "+to_hex(f_val,2) : (to_hex(f_cmd,2) + "" + to_hex(f_val,2));
        if(f_cmd > 0){ classes += "fh "; }
      }

      o_f.className = classes;
    }
  }
}

lobby.apps.marabu.setup.confirm("editor");
