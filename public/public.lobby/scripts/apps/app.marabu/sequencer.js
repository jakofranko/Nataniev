function Sequencer()
{
  this.sequence = {length:32,selection:{x1:0,y1:0,x2:0,y2:0}}
  this.pattern = {beat:4,length:32,selection:{x1:0,y1:0,x2:0,y2:0}}

  var target = this;

  this.status = function()
  {
    var html = "";

    // Seq
    html += "SEQ("+this.sequence.selection.x1+":"+this.sequence.selection.y1+" "+this.sequence.selection.x2+":"+this.sequence.selection.y2+") ";

    // Pat
    html += "PAT("+this.pattern.selection.x1+":"+this.pattern.selection.y1+" "+this.pattern.selection.x2+":"+this.pattern.selection.y2+") ";

    return html;
  }


  this.build = function()
  {
    var html = "";

    html += "  <div class='sequencer' id='sequence_controller' style='width:120px; display:inline-block; vertical-align:top'>";
    html += "    <h1 class='lh30'><b>SEQ</b><input id='bpm' type='text' size='3' value='' title='Beats per minute (song speed)' class='bh fh'/></h1>";
    html += "    <div id='sequencer'><table class='tracks' id='sequencer-table'></table></div>";
    html += "  </div>";
    html += "  <div class='pattern' id='pattern_controller' style='width:130px; display:inline-block; vertical-align:top; border-left:1px solid #333; padding-left:30px; margin-left:-5px'>";
    html += "    <h1 class='lh30'><b>PAT</b> <input id='rpp' type='text' size='3' value='' title='Rows per pattern' class='bh fh' /></h1>";
    html += "    <div id='pattern'><table class='tracks' id='pattern-table'></table>";
    html += "  </div>";

    return html;
  }

  this.update = function()
  {
    lobby.commander.update_status();
  }

  // 
  // Sequence Table
  // 

  this.sequence_mouse_down = function(e)
  {
    var col = parseInt(e.target.id.slice(2,3));
    var row = parseInt(e.target.id.slice(4));

    lobby.apps.marabu.sequencer.sequence.selection.x1 = col;
    lobby.apps.marabu.sequencer.sequence.selection.x2 = col;
    lobby.apps.marabu.sequencer.sequence.selection.y1 = row;
    lobby.apps.marabu.sequencer.sequence.selection.y2 = row;

    lobby.apps.marabu.sequencer.update();

    target.refresh_sequence_table();
    target.refresh_pattern_table();
  }

  this.sequence_mouse_move = function()
  {
    lobby.apps.marabu.sequencer.update();
  }

  this.sequence_mouse_up = function()
  {
    lobby.apps.marabu.sequencer.update();
    target.refresh_pattern_table();
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
        td.addEventListener("mouseover", this.sequence_mouse_move, false);
        td.addEventListener("mouseup", this.sequence_mouse_up, false);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
  }

  this.refresh_sequence_table = function()
  {
    for (var r = 0; r < this.sequence.length; ++r)
    {
      for (var c = 0; c < 8; ++c)
      {
        var o = document.getElementById("sc" + c + "r" + r);
        var pat = GUI.song().songData[c].p[r];
        var classes = "";
        if(pat > 0){ classes += "pattern_"+pat+" "; }
        if (r >= this.sequence.selection.y1 && r <= this.sequence.selection.y2 && c >= this.sequence.selection.x1 && c <= this.sequence.selection.x2){ classes += "selected "; }
        o.className = classes;
        o.textContent = pat ? pat : "-";
      }
    }
  }

  // 
  // Pattern Table
  // 

  this.pattern_mouse_down = function(e)
  {
    var col = parseInt(e.target.id.slice(2,3));
    var row = parseInt(e.target.id.slice(4));

    lobby.apps.marabu.sequencer.pattern.selection.x1 = col;
    lobby.apps.marabu.sequencer.pattern.selection.x2 = col;
    lobby.apps.marabu.sequencer.pattern.selection.y1 = row;
    lobby.apps.marabu.sequencer.pattern.selection.y2 = row;
    lobby.apps.marabu.sequencer.update();

    target.refresh_pattern_table();
  }

  this.pattern_mouse_move = function()
  {
    lobby.apps.marabu.sequencer.update();
    target.refresh_pattern_table();
  }

  this.pattern_mouse_up = function()
  {
    lobby.apps.marabu.sequencer.update();
    target.refresh_pattern_table();
  }

  this.effect_mouse_down = function(e)
  {
    var row = parseInt(e.target.id.slice(3));

    console.log(row);
  }

  this.build_pattern_table = function()
  {
    var table = document.getElementById("pattern-table");
    // Clean
    while (table.firstChild){
      table.removeChild(table.firstChild);
    }
    var tr, td;
    for (var row = 0; row < this.pattern.length; row++) {
      tr = document.createElement("tr");
      tr.className = row % this.pattern.beat == 0 ? "beat" : "";
      // Pattern
      for (col = 0; col < 4; col++) {
        td = document.createElement("td");
        td.id = "pc" + col + "r" + row;
        td.textContent = "--";
        td.addEventListener("mousedown", this.pattern_mouse_down, false);
        td.addEventListener("mouseover", this.pattern_mouse_move, false);
        td.addEventListener("mouseup", this.pattern_mouse_up, false);
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

  this.selected_instrument = function()
  {
    return this.sequence.selection.x2;
  }

  this.refresh_pattern_table = function()
  {
    var pat = GUI.instrument().p[this.selected_instrument()] - 1;

    for (var r = 0; r < this.pattern.length; ++r)
    {
      for (var c = 0; c < 4; ++c)
      {
        var o = document.getElementById("pc" + c + "r" + r);
        var classes = "";

        if (r >= this.pattern.selection.y1 && r <= this.pattern.selection.y2 && c >= this.pattern.selection.x1 && c <= this.pattern.selection.x2){ classes += "selected "; }

        if(GUI.instrument().c[pat]){
          var n = GUI.instrument().c[pat].n[r+c*GUI.song().patternLen] - 87;
          if(n > 0){
            var octaveName = Math.floor(n / 12);
            var noteName = mNoteNames[n % 12];
            var sharp = noteName.substr(1,1) == "#" ? true : false;

            classes += "octave_"+octaveName+" ";
            classes += "note_"+noteName.substr(0,1)+" ";
            classes += sharp ? "sharp " : "";
            o.textContent = noteName+octaveName;
          }
          else{
            o.textContent = "--";
          }
        }
        o.className = classes;
      }
    }
  }
}

lobby.apps.marabu.setup.confirm("sequencer");
