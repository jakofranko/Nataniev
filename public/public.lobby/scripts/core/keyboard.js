function Keyboard()
{
  this.host = null;

  this.shift_held = false;
  this.alt_held = false;

  this.start = function()
  {
    document.onkeyup = function myFunction(){ lobby.keyboard.listen_onkeyup(event); };
    document.onkeydown = function myFunction(){ lobby.keyboard.listen_onkeydown(event); };
  }
  
  this.listen_onkeydown = function(event)
  {
    if(lobby.commander.is_typing() && lobby.commander.autocomplete && event.key == "Tab" ){
      lobby.commander.inject(lobby.commander.autocomplete);
      event.preventDefault();
    }
    else if(lobby.commander.app){ 
      if(event.ctrlKey && event.key.toLowerCase() != "control"){
        lobby.commander.app.when.control_key(event.key.toLowerCase());
        event.preventDefault();
      }
      else if(event.altKey && event.key.toLowerCase() != "alt"){
        lobby.commander.app.when.option_key(event.key.toLowerCase(),event.keyCode);
        event.preventDefault();
      }
      else if(!lobby.commander.is_typing()){
        lobby.commander.app.when.key(event.key);
        if(event.altKey && event.key == "Tab"){ lobby.commander.input_el.focus(); event.preventDefault(); }
        if(event.key == "Tab"){ event.preventDefault(); }
      }
    }
  }

  this.listen_onkeyup = function(event)
  {
    // Tab
    if(event.keyCode == 9 && event.ctrlKey){
      lobby.commander.input_el.focus();
      lobby.commander.update_hint();
      event.preventDefault();
    }
  }
}
