lobby.apps.marabu.methods.render = {name:"render", shortcut:"r", run_shortcut:true}

lobby.apps.marabu.render = function(val, is_passive = false)
{
  this.song.export_wav();
}

lobby.apps.marabu.setup.confirm("methods/render");