lobby.apps.marabu.methods.stop = {name:"stop", shortcut:"q", run_shortcut:true}

lobby.apps.marabu.stop = function(val, is_passive = false)
{
  console.log("Stop!")
  this.song.stop_song();
}

lobby.apps.marabu.setup.confirm("methods/stop");