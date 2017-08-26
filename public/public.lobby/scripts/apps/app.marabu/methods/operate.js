lobby.apps.marabu.methods.operate = {name:"operate", shortcut:"o", params:"r:rate"}

lobby.apps.marabu.operate = function(val, is_passive = false)
{
  var loop = val.split(" ")[0].split(""); // s.charAt(0)
  var rate = parseInt(lobby.commander.find_variable("r:",4));

  var counter = 0; // marabu.operate 0259 r:2
  for(var row = 0; row < 32; row++){
    if(row % rate != 0){ continue; }
    var mod = parseInt(loop[counter]);
    var note = (this.selection.octave * 12)+mod;

    this.song.inject_note_at(this.selection.instrument,this.selection.track,row,note);

    counter += 1;
    counter = counter % loop.length;
  }
  this.update();
}

lobby.apps.marabu.setup.confirm("methods/operate");