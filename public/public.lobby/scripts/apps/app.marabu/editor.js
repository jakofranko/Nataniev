function Editor()
{
  var app = lobby.apps.marabu;
  var target = this;

  this.selection = {x1:0,y1:0,x2:0,y2:0};
  this.pattern = {beat:4,length:32};

  this.status = function()
  {
    var html = "";
    html += "PAT("+this.selection.x1+":"+this.selection.y1+" "+this.selection.x2+":"+this.selection.y2+") ";
    return html;
  }

  this.build = function()
  {
    var html = "";

    html += "  <div class='pattern' id='pattern_controller' style='width:130px; display:inline-block; vertical-align:top; border-left:1px solid #333; padding-left:30px; margin-left:-5px'>";
    html += "    <h1 class='lh30'><b>PAT</b> <input id='rpp' type='text' size='3' value='' title='Rows per pattern' class='bh fh' /></h1>";
    html += "    <div id='pattern'><table class='tracks' id='pattern-table'></table>";
    html += "  </div>";

    return html;
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
    target.refresh_table();
  }

  this.pattern_mouse_move = function()
  {
    target.refresh_table();
  }

  this.pattern_mouse_up = function()
  {
    target.refresh_table();
    lobby.commander.update_status();
  }

  this.effect_mouse_down = function(e)
  {
    var row = parseInt(e.target.id.slice(3));

    console.log(row);
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

  this.refresh_table = function()
  {
    var pat = GUI.instrument().p[app.instrument.id] - 1;

    for (var r = 0; r < this.pattern.length; ++r)
    {
      for (var c = 0; c < 4; ++c)
      {
        var o = document.getElementById("pc" + c + "r" + r);
        var classes = "";

        if (r >= this.selection.y1 && r <= this.selection.y2 && c >= this.selection.x1 && c <= this.selection.x2){ classes += "selected "; }

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

lobby.apps.marabu.setup.confirm("editor");
