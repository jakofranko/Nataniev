lobby.apps.ide.methods.load = {name:"load", shortcut:"l", passive:true}

lobby.apps.ide.load = function(val, is_passive = false)
{
  if(is_passive){
    lobby.commander.show_browser();
    lobby.commander.browse_candidates(val,this.formats);
    return;
  }

  this.window.show();
  lobby.commander.hide_browser();
  this.load_file(lobby.commander.select_candidate(val,this.formats));
}