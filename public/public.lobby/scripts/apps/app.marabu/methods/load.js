lobby.apps.marabu.methods.load = {name:"load", shortcut:"l", passive:true}

lobby.apps.marabu.load = function(val, is_passive = false)
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

lobby.apps.marabu.load_file = function(file_path)
{
  this.location = file_path;

  var app = this;
  $.ajax({url: '/ide.load',
    type: 'POST', 
    data: { file_path: this.location },
    success: function(data) {
      console.log(data)
      var j = JSON.parse(data);
      console.log(j);
    }
  })
}

lobby.apps.marabu.setup.confirm("methods/load");