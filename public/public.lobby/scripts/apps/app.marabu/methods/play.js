lobby.apps.marabu.methods.play = {name:"play", shortcut:"a", run_shortcut:true}

lobby.apps.marabu.play = function(val, is_passive = false)
{
  console.log("Play!")
  this.song.play_song();
}

lobby.apps.marabu.setup.confirm("methods/play");