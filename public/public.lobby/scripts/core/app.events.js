function App_Events()
{
  var target = this;

  this.when = 
  {
    app : target,
    
    bind : function()
    {
      lobby.touch.depth += 1;
      this.app.window.depth = lobby.touch.depth;
      this.app.window.update(false);
    },

    move : function()
    {
      
    },

    resize : function()
    {
      
    },

    option_key : function(key,code) // Global
    {
      switch(key)
      {
        case "arrowup": this.app.window.move_by({x:0,y:-30}); break;
        case "arrowdown": this.app.window.move_by({x:0,y:30}); break;
        case "arrowleft": this.app.window.move_by({x:-30,y:0}); break;
        case "arrowright": this.app.window.move_by({x:30,y:0}); break;
        case "‘": this.app.window.organize.right(); break;
        case "“": this.app.window.organize.left(); break;
      }

      switch(code)
      {
        // WASD
        case 87: this.app.window.resize_by({width:0,height:-30}); break; 
        case 65: this.app.window.resize_by({width:-30,height:0}); break; 
        case 83: this.app.window.resize_by({width:0,height:30}); break; 
        case 68: this.app.window.resize_by({width:30,height:0}); break; 
        // Q < - > E
        case 81: this.app.window.organize.left(); break;         
        case 69: this.app.window.organize.right(); break;         
        case 67: this.app.window.organize.center(); break;         
        case 192: this.app.window.organize.full(); break;         
        case 27: this.app.window.organize.fill(); break;   
        // Hide(H)
        case 72: this.app.window.toggle(); break;   
        // Themes (1,2,3)
        case 49: this.app.window.set_theme("blanc"); break;
        case 50: this.app.window.set_theme("noir"); break;
        case 51: this.app.window.set_theme("ghost"); break;
        // Tab
        case 9: lobby.commander.next_app(); break;
      }
    },

    control_key : function(key) // Override
    {
      for(method_id in this.app.methods){
        var method = this.app.methods[method_id];
        if(method.shortcut != key){ continue; }
        console.log("Shortcut",method);
        if(method.run_shortcut){
          this.app[method.name](); 
          return;
        }
        else{
          lobby.commander.inject(this.app.name+"."+method.name+" ");
          lobby.commander.input_el.focus()
          return;
        }
      }
      console.log("Unknown shortcut <"+key+"> for "+this.app.name);
    },

    key : function(key)
    {
      // Override
    }
  }
}