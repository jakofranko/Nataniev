lobby.apps.ronin.methods.load = {name:"load", shortcut:"l", passive:true}

lobby.apps.ronin.load = function(param)
{
  this.load = function(val, is_passive = false)
  {
    if(is_passive){
      lobby.commander.show_browser();
      lobby.commander.browse_candidates(val,this.formats);
    }
    else{
      this.show();
      lobby.commander.hide_browser();
      this.load_file(lobby.commander.select_candidate(val,this.formats));
    }
    return val;
  }

  this.load_file = function(file_path)
  {
    this.location = file_path;

    var app = this;
    $.ajax({url: '/ide.load',
      type: 'POST', 
      data: { file_path: this.location },
      success: function(data) {
        console.log(data)
      }
    })
  }
}

lobby.apps.ronin.setup.confirm("methods/load");