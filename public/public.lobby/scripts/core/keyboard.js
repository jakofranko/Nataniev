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
    if(lobby.commander.app){ 
      if(event.ctrlKey && event.key.toLowerCase() != "control"){
        lobby.commander.app.when.control_key(event.key.toLowerCase());
      }
      if(event.altKey && event.key.toLowerCase() != "alt"){
        lobby.commander.app.when.option_key(event.key.toLowerCase());
      }
      return;
    }
    console.log("no app selected")

    return;

    if(event.key == "Tab" && lobby.commander.is_typing()){
      event.preventDefault();
      if(lobby.commander.autocomplete){
        lobby.commander.inject(lobby.commander.autocomplete);
      }
    }
  }

  this.listen_onkeyup = function(event)
  {
    event.preventDefault();
  }
}
