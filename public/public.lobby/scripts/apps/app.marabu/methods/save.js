lobby.apps.marabu.methods.save = {name:"save", shortcut:"s", passive:true}

lobby.apps.marabu.save = function(val, is_passive = false)
{
  if(is_passive){
    if(this.location){
      lobby.commander.update_status("Overwrite <b class='f0'>"+this.location+"</b>?");
    }
    else{
      lobby.commander.update_status("No file selected!");
    }
    return;
  }

  if(!this.location){ return; }

  GUI.update_ranges();
  var str = JSON.stringify(GUI.song());

  $.ajax({url: '/ide.save',
    type: 'POST', 
    data: { file_path: this.location, file_content: str },
    success: function(data) {
      console.log(data);
    }
  })
  
  lobby.commander.notify("Saved.");
  lobby.commander.update_status();
}

lobby.apps.marabu.setup.confirm("methods/save");
