lobby.apps.marabu.methods.render = {name:"render", shortcut:"s"}

lobby.apps.ide.render = function(val, is_passive = false)
{
  GUI.export_wav();
}

lobby.apps.marabu.setup.confirm("methods/render");