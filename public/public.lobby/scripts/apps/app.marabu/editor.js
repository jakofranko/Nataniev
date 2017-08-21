function Editor(t,b)
{
  var app = lobby.apps.marabu;
  var target = this;

  this.edit_mode = false;
  this.selection = {x1:0,y1:0,x2:0,y2:0};
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
    this.pattern.effect = -1;
    this.pattern.id = pattern_id;
    this.select(0,0,0,0);

    document.getElementById("pattern-table").className = pattern_id == -1 ? "tracks inactive" : "tracks";
  }

  this.select = function(x1 = 0,y1 = 0,x2 = 0,y2 = 0)
  {
    this.pattern.effect = -1;
    this.selection = {x1:x1,y1:y1,x2:x2,y2:y2};
    this.refresh();
  }

  this.deselect = function()
  {
    this.select(-1,-1,-1,-1);
  }

  this.select_move = function(x,y)
  {
    var s = this.selection;

    s.x2 += x;
    s.y2 += y;

    if(s.x2 < 0){ s.x2 = 0; }
    if(s.y2 < 0){ s.y2 = 0; }
    if(s.x2 > 3){ s.x2 = 3; }
    if(s.y2 > 31){ s.y2 = 31; }

    s.x1 = s.x2;
    s.y1 = s.y2;

    this.select(s.x1,s.y1,s.x2,s.y2);
  }

  this.edit = function(toggle = true)
  { 
    console.log("editor.edit",toggle);
    this.edit_mode = toggle;

    var table = document.getElementById("pattern-table");
    table.className = toggle ? "tracks edit" : "tracks";

    console.log("instrument:"+app.instrument.id,"pattern:"+this.pattern.id);
  }

  this.inject = function(v)
  {
    var l = this.location();
    app.sequencer.edit_note(l.i,l.p-1,l.n,v + (app.instrument.octave * 12));

    this.selection = {x1:this.selection.x1,y1:this.selection.y2+1,x2:this.selection.x2,y2:this.selection.y2+1};
    this.refresh();    
    lobby.commander.update_status();
  }

  this.location = function()
  {
    return {i:app.instrument.id,p:this.pattern.id,n:this.selection.y2 + (this.selection.x2 * this.pattern.length)};
  }

  this.pattern_mouse_down = function(e)
  {
    var col = parseInt(e.target.id.slice(2,3));
    var row = parseInt(e.target.id.slice(4));

    lobby.commander.update_status();
    target.select(col,row,col,row);
  }

  this.effect_mouse_down = function(e)
  {
    target.deselect();
    var row = parseInt(e.target.id.slice(3));
    target.pattern.effect = row;
    target.refresh();
  }

  this.set_effect = function(cmd,val)
  {
    if(this.pattern.effect < 0){ return; }

    var l = this.location();
    var r = this.pattern.effect;

    app.song.instrument().c[l.p].f[r] = cmd;
    app.song.instrument().c[l.p].f[r+this.pattern.length] = val;

    this.refresh();
  }

  this.refresh = function()
  {
    this.refresh_title();
    this.refresh_table();
  }

  this.refresh_title = function()
  {
    var html = "PAT "+(this.pattern.id > -1 ? this.pattern.id : "");

    if(this.edit_mode){ 
      if(this.selection.x2 > -1 && this.selection.y2 > 0){
        html += " "+this.selection.x2+":"+this.selection.y2;
      }
      else if(this.pattern.effect > -1){
        html += " $"+this.pattern.effect; 
      }
    }

    document.getElementById("pat_title").innerHTML = html;
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

    console.log(l);

    // 32 x 8
    for(var i = 0; i < 8; i++){
      var instrument_header = document.getElementById("ih"+i);
      var instrument = app.song.song().songData[i];
      var sequence = app.song.song().songData[i].p[app.sequencer.selection.y2];
      instrument_header.textContent = instrument.name ? instrument.name.substr(0,4).toUpperCase() : "";
      if(i == l.i){ instrument_header.className = "fh lh30"; }
      else if(sequence > 0){ instrument_header.className = "fm lh30"; }
      else{ instrument_header.className = "lh30"; }
      // Each Row
      for(var r = 0; r < this.pattern.length; r++){
        var cell = document.getElementById("i"+i+"r"+r);
        var classes = "";
        if(sequence > 0){ classes += "fm "; }
        if(r % this.pattern.signature[1] == 0){ classes += "fm "; }
        cell.className = classes;
      }
    }

    // 32
    for (var r = 0; r < this.pattern.length; ++r)
    {
      var o_f = document.getElementById("fxr"+r);
      if(app.song.instrument().c[l.p]){
        var f_cmd = app.song.instrument().c[l.p].f[r];
        var f_val = app.song.instrument().c[l.p].f[r+this.pattern.length];
        o_f.textContent = (r == this.pattern.effect) ? "> "+toHex(f_val,2) : (toHex(f_cmd,2) + "" + toHex(f_val,2));
      }
      var classes = "";
      if(r % this.pattern.signature[1] == 0){ classes += "fm "; }
      o_f.className = classes;
    }

    // for (var r = 0; r < this.pattern.length; ++r)
    // {
    //   if(app.song.instrument().c[l.p]){
    //     var o_f = document.getElementById("fxr"+r);
    //     var f_cmd = app.song.instrument().c[l.p].f[r];
    //     var f_val = app.song.instrument().c[l.p].f[r+this.pattern.length];
    //     o_f.textContent = (r == this.pattern.effect) ? "> "+toHex(f_val,2) : (toHex(f_cmd,2) + "" + toHex(f_val,2));
    //   }

    //   for (var c = 0; c < 8; ++c)
    //   {
    //     var instrument_id = parseInt(c/2);
    //     var o_n = document.getElementById("i"+instrument_id+"c"+c+"r"+r);
        
    //     var classes = "";

    //     if (r >= this.selection.y1 && r <= this.selection.y2 && c >= this.selection.x1 && c <= this.selection.x2){ classes += "selected "; }

    //     if(app.song.instrument().c[l.p-1]){
    //       var n = app.song.instrument().c[l.p-1].n[r+c*this.pattern.length] - 87;
        
    //       if(n >= 0){
    //         var octaveName = Math.floor(n / 12);
    //         var noteName = ['C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B'][n % 12];
    //         var sharp = noteName.substr(1,1) == "#" ? true : false;

    //         classes += "octave_"+octaveName+" ";
    //         classes += "note_"+noteName.substr(0,1)+" ";
    //         classes += sharp ? "sharp " : "";
    //         o_n.textContent = (r == this.selection.y2 && c == this.selection.x2) ? ">"+octaveName : noteName+octaveName;
    //       }
    //       else{
    //         o_n.textContent = (r == this.selection.y2 && c == this.selection.x2) ? ">" : "----";
    //       }
    //     }
    //     else{
    //       o_n.textContent = "----";
    //     }
    //     o_n.className = classes;
    //   }
    // }
  }

  // Keyboard Events

  this.when = 
  {
    key : function(key)
    {
      var note = -1;

      switch (key)
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

        if(key == "arrowleft"){ target.select_move(-1,0); return; }
        if(key == "arrowright"){ target.select_move(1,0); return; }
        if(key == "arrowup"){ target.select_move(0,-1); return; }
        if(key == "arrowdown"){ target.select_move(0,1); return; }

        if(key == "escape"){ 
          console.log("escape")
          target.edit(false);
          target.deselect();
          app.sequencer.edit(true);
          app.sequencer.select(app.instrument.id,0,app.instrument.id,0);
          return;
        }
        if(key == " " || key == "backspace"){
          target.inject(0); // erase
        }
        if(note > -1){
          target.inject(note + 87);  
        }
      }

      if(note > -1){
        app.instrument.play(note); 
      }
    }
  }
}

lobby.apps.marabu.setup.confirm("editor");
