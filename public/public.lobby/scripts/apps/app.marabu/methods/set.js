lobby.apps.marabu.methods.set_bpm = {name:"set_bpm"}

lobby.apps.marabu.set_bpm = function(val, is_passive = false)
{
  var val = clamp(parseInt(val),80,600);
  this.selection.bpm = val;
  this.song.update_bpm(this.selection.bpm);
}

lobby.apps.marabu.methods.set_rpp = {name:"set_rpp"}

lobby.apps.marabu.set_rpp = function(val, is_passive = false)
{
  console.log("set_rpp",val)
}

lobby.apps.marabu.methods.set_signature = {name:"set_signature"}

lobby.apps.marabu.set_signature = function(val, is_passive = false)
{
  console.log("set_signature",val)
}

lobby.apps.marabu.setup.confirm("methods/set");