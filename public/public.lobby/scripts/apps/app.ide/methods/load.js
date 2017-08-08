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

lobby.apps.ide.load_file = function(file_path)
{
  this.location = file_path;

  var app = this;
  $.ajax({url: '/ide.load',
    type: 'POST', 
    data: { file_path: this.location },
    success: function(data) {
      app.textarea_el.value = data;
      app.textarea_el.style.display = "block";
      app.navi_el.style.display = "block";
      app.history.push(app.location);
      app.navi.update();
      app.textarea_el.scrollTop = 0;
      lobby.commander.update_status();
    }
  })
}

lobby.apps.ide.setup.confirm("methods/load");