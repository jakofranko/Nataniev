function Editor()
{
  var app = lobby.apps.marabu;
  var target = this;

  this.edit_mode = false;
  this.selection = {x1:0,y1:0,x2:0,y2:0};
  this.pattern = {id:0,beat:4,length:32};

  this.rpp_el = document.getElementById("rpp");
  // this.rpp_el.addEventListener('input', rpp_update, false);

  this.status = function()
  {
    var html = "";
    html += "PAT(#"+this.pattern.id+" "+this.selection.x1+":"+this.selection.y1+" "+this.selection.x2+":"+this.selection.y2+") ";
    return html;
  }

  this.build = function()
  {
    var html = "";

    html += "  <div class='pattern' id='pattern_controller' style='width:130px; display:inline-block; vertical-align:top; border-left:1px solid #333; padding-left:30px; margin-left:-5px'>";
    html += "    <h1 class='lh30' style='width:105px'><b id='pat_title'>PAT</b> <t id='rpp' class='bh fh' style='float:right; text-align:right; height:30px; color:#999; line-height:30px; background:transparent'/></h1>";
    html += "    <div id='pattern'><table class='tracks' id='pattern-table'></table>";
    html += "  </div>";

    return html;
  }

  this.load = function(pattern_id = 0)
  {
    this.pattern.id = pattern_id;
    this.selection = {x1:0,y1:0,x2:0,y2:0};
    this.refresh();

    document.getElementById("pattern-table").className = pattern_id == -1 ? "tracks inactive" : "tracks";
  }

  this.select = function(x1 = 0,y1 = 0,x2 = 0,y2 = 0)
  {
    this.selection = {x1:x1,y1:y1,x2:x2,y2:y2};
    this.refresh();
  }

  this.deselect = function()
  {
    this.selection = {x1:-1,y1:-1,x2:-1,y2:-1};
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
    app.sequencer.edit_mode = false;
    app.instrument.edit_mode = false;
    
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

  function rpp_update()
  {
    if(GUI.pattern_controller.rpp_el.value == ""){ return; }
    var new_rpp = parseInt(GUI.pattern_controller.rpp_el.value);
    if(new_rpp < 4){ new_rpp = 4; }
    if(new_rpp > 16){ new_rpp = 16; }
    GUI.update_rpp(new_rpp);
  }

  this.pattern_mouse_down = function(e)
  {
    var col = parseInt(e.target.id.slice(2,3));
    var row = parseInt(e.target.id.slice(4));

    app.editor.selection.x1 = col;
    app.editor.selection.x2 = col;
    app.editor.selection.y1 = row;
    app.editor.selection.y2 = row;

    lobby.commander.update_status();
    target.refresh();
  }

  this.effect_mouse_down = function(e)
  {
    var row = parseInt(e.target.id.slice(3));
  }

  this.build_table = function()
  {
    var table = document.getElementById("pattern-table");
    // Clean
    while (table.firstChild){
      table.removeChild(table.firstChild);
    }
    var tr, td;
    for (var row = 0; row < this.pattern.length; row++) {
      tr = document.createElement("tr");
      tr.id = "ppr"+row;
      tr.className = row % this.pattern.beat == 0 ? " beat" : "";
      // Pattern
      for (col = 0; col < 4; col++) {
        td = document.createElement("td");
        td.id = "pc" + col + "r" + row;
        td.textContent = "--";
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

  this.refresh = function()
  {
    this.refresh_table();
    this.refresh_title();
  }

  this.refresh_title = function()
  {
    var html = "PAT ";

    if(this.edit_mode){ html += this.pattern.id+":"+this.selection.x2+":"+this.selection.y2; }

    document.getElementById("pat_title").innerHTML = html;
  }

  var toHex = function (num, count)
  {
    var s = num.toString(16).toUpperCase();
    var leadingZeros = count - s.length;
    for (var i = 0; i < leadingZeros; ++i)
      s = "0" + s;
    return s;
  };

  this.refresh_table = function()
  {
    var l = this.location();

    document.getElementById("pattern-table").className = l.p == -1 ? "tracks inactive" : "tracks";

    for (var r = 0; r < this.pattern.length; ++r)
    {
      if(GUI.instrument().c[l.p]){
        var o_f = document.getElementById("fxr"+r);
        var f_cmd = GUI.instrument().c[l.p].f[r];
        var f_val = GUI.instrument().c[l.p].f[r+this.pattern.length];
        o_f.textContent = toHex(f_cmd,2) + "" + toHex(f_val,2); //  TODO
      }

      for (var c = 0; c < 4; ++c)
      {
        var o_n = document.getElementById("pc" + c + "r" + r);
        
        var classes = "";

        if (r >= this.selection.y1 && r <= this.selection.y2 && c >= this.selection.x1 && c <= this.selection.x2){ classes += "selected "; }

        if(GUI.instrument().c[l.p-1]){
          var n = GUI.instrument().c[l.p-1].n[r+c*this.pattern.length] - 87;
        
          if(n >= 0){
            var octaveName = Math.floor(n / 12);
            var noteName = ['C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B'][n % 12];
            var sharp = noteName.substr(1,1) == "#" ? true : false;

            classes += "octave_"+octaveName+" ";
            classes += "note_"+noteName.substr(0,1)+" ";
            classes += sharp ? "sharp " : "";
            o_n.textContent = (r == this.selection.y2 && c == this.selection.x2) ? ">"+octaveName : noteName+octaveName;
          }
          else{
            o_n.textContent = (r == this.selection.y2 && c == this.selection.x2) ? ">" : "--";
          }
        }
        else{
          o_n.textContent = "--";
        }
        o_n.className = classes;
      }
    }
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

      if(target.edit_mode){ 

        if(key == "arrowleft"){ target.select_move(-1,0); return; }
        if(key == "arrowright"){ target.select_move(1,0); return; }
        if(key == "arrowup"){ target.select_move(0,-1); return; }
        if(key == "arrowdown"){ target.select_move(0,1); return; }

        if(key == "escape"){ 
          target.edit(false);
        }
        if(key == " "){
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
