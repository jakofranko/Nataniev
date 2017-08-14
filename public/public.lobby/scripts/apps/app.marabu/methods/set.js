lobby.apps.marabu.methods.set_bpm = {name:"set_bpm"}

lobby.apps.marabu.set_bpm = function(val, is_passive = false)
{
  console.log("set_bpm",val)
}

lobby.apps.marabu.methods.set_rpp = {name:"set_rpp"}

lobby.apps.marabu.set_rpp = function(val, is_passive = false)
{
  console.log("set_rpp",val)
}

lobby.apps.marabu.setup.confirm("methods/set");