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


  // Old

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

  this.location = function()
  {
    var p = app.song.song().songData[app.instrument.id].p[app.selection.track];
    return {i:app.instrument.id,s:app.selection.track,p:p};
  }

  // 
  // Sequence Table
  // 

  this.location_name_el = null;

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
    this.location_name_el = th;
    // Main
    var tr, td;
    for (var t = 0; t < 32; t++) {
      tr = document.createElement("tr");
      tr.id = "spr"+t;
      for (var i = 0; i < 8; i++) {
        td = document.createElement("td");
        td.id = "sc" + i + "t" + t;
        td.textContent = "-";
        td.addEventListener("mousedown", this.sequence_mouse_down, false);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
  }

  this.update = function()
  {
    this.location_name_el.textContent = app.location_name().toUpperCase();

    var l = this.location();

    for (var t = 0; t < 32; ++t)
    {
      for (var i = 0; i < 8; ++i)
      {
        var o = document.getElementById("sc" + i + "t" + t);
        var pat = app.song.pattern_at(i,t);
        var t_length = app.song.song().endPattern-2;
        // Default
        o.className = t > t_length ? "fl" : "fm";
        o.textContent = pat ? to_hex(pat) : "-";
        // Special
        if(t == app.selection.track && i == app.selection.instrument){ o.className = "fh"; }
      }
    }
  }
}

lobby.apps.marabu.setup.confirm("sequencer");
