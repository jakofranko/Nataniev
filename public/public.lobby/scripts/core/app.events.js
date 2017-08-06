function App_Events()
{
  var target = this;

  this.when = 
  {
    app : target,
    
    move : function()
    {
      
    },

    resize : function()
    {
      
    },

    option_key : function(key) // Global
    {
      switch(key)
      {
        case "arrowup": this.app.window.move_by({x:0,y:-30}); break;
        case "arrowdown": this.app.window.move_by({x:0,y:30}); break;
        case "arrowleft": this.app.window.move_by({x:-30,y:0}); break;
        case "arrowright": this.app.window.move_by({x:30,y:0}); break;
        case "escape": this.app.window.organize.fill(); break;
        case "‘": this.app.window.organize.right(); break;
        case "“": this.app.window.organize.left(); break;
        case "˙": this.app.window.toggle(); break;
        case "…": this.app.window.set_theme("blanc"); break;
        case "æ": this.app.window.set_theme("noir"); break;
        case "¬": this.app.window.set_theme("ghost"); break;
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
    },

    key : function(key)
    {
      // Override
    }
  }
}