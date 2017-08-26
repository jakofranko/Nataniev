lobby.apps.ide.methods.project = {name:"project", shortcut:"p", passive:true}

lobby.apps.ide.project = function(val, is_passive = false)
{
  if(is_passive){
    lobby.commander.show_browser();
    lobby.commander.browse_candidates(val,this.formats);
    return;
  }

  var p = lobby.commander.find_candidates(val,this.formats);

  lobby.apps.ide.history = [];
  for(file_id in p){
    lobby.apps.ide.history.push(p[file_id]);
  }
  lobby.apps.ide.navi.update();
}

lobby.apps.ide.setup.confirm("methods/project");