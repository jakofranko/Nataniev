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
    if(event.shiftKey == true){
      this.shift_held = true;
    }
    if(event.altKey == true){
      this.alt_held = true;
    }
  }

  this.listen_onkeyup = function(event)
  {
    this.shift_held = false;
    this.alt_held = false;

    event.preventDefault();

    this.host = !lobby.commander.app ? lobby.commander : lobby.commander.app;

    switch (event.key || event.keyCode || event.which)
    {
      case "ArrowUp": this.host.key_arrow_up(); break;
      case "ArrowDown": this.host.key_arrow_down(); break;
      case "ArrowLeft": this.host.key_arrow_left(); break;
      case "ArrowRight": this.host.key_arrow_right(); break;

      case "Escape" || 27:  this.host.key_escape(); break;
      // case "Backspace" || 8:  this.host.key_delete(); break;
      case "Enter" :  this.host.key_enter(); break;

      // Pattern Mods
      case "]": this.host.key_square_bracket_right(); break;
      case "[": this.host.key_square_bracket_left(); break;
      case "}": this.host.key_curly_bracket_right(); break;
      case "{": this.host.key_curly_bracket_left(); break;

      case 192: this.host.key_back_quote(); break;
      case "`": this.host.key_back_quote(); break;
    }

  }
}
