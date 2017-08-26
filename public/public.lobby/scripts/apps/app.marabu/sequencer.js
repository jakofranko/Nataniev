function Sequencer()
{
  var app = lobby.apps.marabu;
  var target = this;

  this.follower = new Sequencer_Follower();
  this.sequence = {length:32}

  this.start = function()
  {
    console.log("Started Sequencer");

    var table = document.getElementById("sequencer-table");
    var tr = document.createElement("tr");
    var tr, td;
    for (var t = 0; t < 32; t++) {
      tr = document.createElement("tr");
      tr.id = "spr"+t;
      tr.style.lineHeight = "15px";
      for (var i = 0; i < app.channels; i++) {
        td = document.createElement("td");
        td.id = "sc" + i + "t" + t;
        td.textContent = "-";
        td.addEventListener("mousedown", this.sequence_mouse_down, false);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
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

  this.update = function()
  {
    for (var t = 0; t < 32; ++t)
    {
      var tr = document.getElementById("spr" + t);
      tr.className = t == app.selection.track ? "bl" : "";

      for (var i = 0; i < app.channels; ++i)
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
