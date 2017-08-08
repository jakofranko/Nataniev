lobby.apps.ide.methods.save = {name:"save", shortcut:"s", passive:true}

lobby.apps.ide.save = function(val, is_passive = false)
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

  $.ajax({url: '/ide.save',
    type: 'POST', 
    data: { file_path: this.location, file_content: this.textarea_el.value },
    success: function(data) {
      console.log(data);
    }
  })
  
  lobby.commander.notify("Saved.");
  this.textarea_el.style.display = "block";
  this.navi_el.style.display = "block";
  lobby.commander.update_status();
}

lobby.apps.ide.setup.confirm("methods/save");