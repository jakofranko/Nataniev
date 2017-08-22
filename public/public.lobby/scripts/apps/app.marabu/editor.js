function Editor(t,b)
{
  var app = lobby.apps.marabu;
  var target = this;

  this.edit_mode = false;
  this.selection = {x:0,y:0,e:-1};
  this.pattern = {id:0,beat:4,length:(t*b),signature:[t,b],effect:-1};

  this.signature_el = document.getElementById("signature");

  this.build = function()
  {
    var html = "";

    html += "  <div class='pattern' id='pattern_controller' style='width:320px; display:inline-block; vertical-align:top; border-left:1px solid #333; padding-left:30px; margin-left:-5px'>";
    html += "    <h1 class='lh30 hide' style='width:105px'><b id='pat_title'>PAT</b> <t id='time_signature' class='bh fm' style='float:right; text-align:right; height:30px;  line-height:30px; background:transparent'></t></h1>";
    html += "    <div id='pattern'><table class='tracks' id='pattern-table'></table>";
    html += "  </div>";

    return html;
  }

  this.load = function(pattern_id = 0)
  {
    this.select(0,0,-1);

    document.getElementById("pattern-table").className = pattern_id == -1 ? "tracks inactive" : "tracks";
  }

  this.select = function(x = 0,y = 0,e = -1)
  {    
    this.selection.x = x;
    this.selection.y = y;
    this.selection.e = e;

    if(e == -1){ app.instrument.select(x); }
    else if(e >= 0 && this.location().p == 0){ this.selection.e = -1; }

    this.refresh();
    app.sequencer.selection.x = x;
    app.sequencer.refresh();
    app.instrument.refresh();
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

    this.refresh();    
    lobby.commander.update_status();
  }

  this.location = function()
  {
    // Get pattern
    var sequence = app.sequencer.location().s;
    var pattern_id = app.song.instrument().p[sequence];
    var note = this.selection.y;
    var note_val = app.song.instrument().c[pattern_id].n[note];
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

  this.set_effect = function(cmd,val)
  {
    var l = this.location();
    var r = this.selection.e;

    // console.log(cmd,val,app.song)

    if(this.selection.e < 0 || !app.song.instrument().c[l.p-1]){ return; }

    app.song.instrument().c[l.p-1].f[r] = cmd+1;
    app.song.instrument().c[l.p-1].f[r+32] = val;  
    this.refresh();  
  }

  this.refresh = function()
  {
    this.refresh_title();
    this.refresh_table();
  }

  this.refresh_title = function()
  {
    document.getElementById("time_signature").innerHTML = this.pattern.signature[0]+"&"+this.pattern.signature[1];
  }

  var toHex = function (num, count)
  {
    var s = num.toString(16).toUpperCase();
    var leadingZeros = count - s.length;
    for (var i = 0; i < leadingZeros; ++i)
      s = "0" + s;
    return s;
  };

  function parse_note(val)
  {
    val -= 87;
    var notes = ['C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#', 'A-', 'A#', 'B-'];
    var octave = Math.floor((val)/12);
    var key = notes[(val) % 12];
    var key_sharp = key.substr(1,1) == "#" ? true : false;
    var key_note = key.substr(0,1);
    return {octave:octave,sharp:key_sharp,note:key_note};
  }

  this.build_table = function()
  {
    var table = document.getElementById("pattern-table");
    // Clean
    while (table.firstChild){
      table.removeChild(table.firstChild);
    }
    // INS NAMES
    var tr = document.createElement("tr");
    for (var col = 0; col < 8; col++) {
      var th = document.createElement("th");
      th.id = "ih"+col;
      th.className = "lh30 bold";
      th.textContent = "KICK";
      tr.appendChild(th);
    }
    table.appendChild(tr);
      
    // Main
    var tr, td;
    for(var row = 0; row < this.pattern.length; row++) {
      tr = document.createElement("tr");
      tr.id = "ppr"+row;
      tr.className = row % this.pattern.signature[1] == 0 ? " fm" : "";
      // Pattern
      for (col = 0; col < 8; col++) {
        td = document.createElement("td");
        td.id = "i"+col+"r"+row;
        td.textContent = "----";
        td.addEventListener("mousedown", this.pattern_mouse_down, false);
        tr.appendChild(td);
      }
      // FX
      var th = document.createElement("th");
      th.id = "fxr" + row;
      th.textContent = String.fromCharCode(160);
      th.addEventListener("mousedown", this.effect_mouse_down, false);
      tr.appendChild(th);
      // End
      table.appendChild(tr);
    }
  }

  this.refresh_table = function()
  {
    var l = this.location();

    document.getElementById("pattern-table").className = l.p == -1 ? "tracks inactive" : "tracks";

    // 32 x 8
    for(var i = 0; i < 8; i++){
      var instrument_header = document.getElementById("ih"+i);
      var instrument = app.song.song().songData[i];
      var sequence = app.song.song().songData[i].p[app.sequencer.selection.y];
      instrument_header.textContent = instrument.name ? instrument.name.substr(0,4).toUpperCase() : "";
      if(i == l.i){ instrument_header.className = "fh lh30"; }
      else if(sequence > 0){ instrument_header.className = "fm lh30"; }
      else{ instrument_header.className = "lh30"; }
      // Each Row
      for(var r = 0; r < this.pattern.length; r++){
        var row_el = document.getElementById("ppr"+r);
        
        row_el.className = "";
        
        var cell = document.getElementById("i"+i+"r"+r);
        var left_note = app.song.song().songData[i].c[sequence-1] ? app.song.song().songData[i].c[sequence-1].n[r] : null;
        var right_note = app.song.song().songData[i].c[sequence-1] ? app.song.song().songData[i].c[sequence-1].n[r+32] : null;
        var effect_cmd = app.song.song().songData[i].c[sequence-1] ? app.song.song().songData[i].c[sequence-1].f[r] : null;

        var left_string = "--";
        var right_string = "--";

        if(effect_cmd){
          right_string = toHex(effect_cmd,2);
        }

        // Left Hand
        if(left_note > 0){
          var n = parse_note(left_note); 
          left_string = n.note+""+n.octave;
        }

        // Right Hand
        if(right_note > 0){
          var n = parse_note(right_note);
          right_string = n.note+""+n.octave;
        }

        cell.textContent = left_string+right_string;

        // Classes
        var classes = "";

        if(effect_cmd){ classes += "bi fi "; }
        else if(left_note > 0 || right_note > 0){ classes += "fh "; }
        else if(this.selection.y == r && i == l.i){ classes += "fh "; }
        else if(r % this.pattern.signature[1] == 0 && sequence > 0){ classes += "fm "; }
        else if(sequence > 0){ classes += "fl "; }
        else if(sequence == 0){ classes += "fl "; }
        cell.className = classes;
      }
    }

    // 32
    for (var r = 0; r < this.pattern.length; ++r)
    {
      var classes = "";
      var o_f = document.getElementById("fxr"+r);
      if(r == this.selection.e){ classes += "fh "; }
      if(r % this.pattern.signature[1] == 0){ classes += "fm "; }

      if(app.song.instrument().c[l.p]){
        var f_cmd = app.song.instrument().c[l.p-1] ? app.song.instrument().c[l.p-1].f[r] : 0;
        var f_val = app.song.instrument().c[l.p-1] ? app.song.instrument().c[l.p-1].f[r+this.pattern.length] : 0;
        o_f.textContent = (r == this.selection.e) ? "> "+toHex(f_val,2) : (toHex(f_cmd,2) + "" + toHex(f_val,2));
        if(f_cmd > 0){ classes += "fh "; }
      }

      o_f.className = classes;
    }
  }

  // Keyboard Events

  this.when = 
  {
    key : function(key)
    {
      var note = -1;

      switch (key.toLowerCase())
      {
        case "a": note = 0; break;
        case "s": note = 2; break;
        case "d": note = 4; break;
        case "f": note = 5; break;
        case "g": note = 7; break;
        case "h": note = 9; break;
        case "j": note = 11; break;

        case "w": note = 1; break;
        case "e": note = 3; break;
        case "t": note = 6; break;
        case "y": note = 8; break;
        case "u": note = 10; break;
      }

      if(target.edit_mode == true){ 

        if(key == "ArrowLeft"){ target.select_move(-1,0); return; }
        if(key == "ArrowRight"){ target.select_move(1,0); return; }
        if(key == "ArrowUp"){ target.select_move(0,-1); return; }
        if(key == "ArrowDown"){ target.select_move(0,1); return; }

        if(key == "Escape"){ 
          console.log("Escape")
          target.edit(false);
          target.deselect();
          app.sequencer.edit(true);
          app.sequencer.select(app.instrument.id,0,app.instrument.id,0);
          return;
        }
        if(key == " " || key == "Backspace"){
          target.inject(0); // erase
        }
        if(note > -1){
          target.inject(note + 87,key == key.toLowerCase());  
        }
      }

      if(note > -1){
        app.instrument.play(note); 
      }
    }
  }
}

lobby.apps.marabu.setup.confirm("editor");
