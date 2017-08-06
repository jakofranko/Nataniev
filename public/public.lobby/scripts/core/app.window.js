function App_Window()
{
  var target = this;

  this.window = 
  {
    app : target,
    size : { width:200, height:200 },
    pos : { x: 0, y: 0 },
    theme : "blanc",
    speed : 50,
    is_visible : false,

    start : function()
    {
      this.app.el.className = this.theme;
      this.move_to(this.pos);
      this.resize_to(this.size);
      this.show();
    },

    move_by : function(pos)
    {
      this.pos = { x: parseInt(this.pos.x) + parseInt(pos.x), y: parseInt(this.pos.y) + parseInt(pos.y)};
      this.update();
      this.app.when.move();
    },

    move_to : function(pos)
    {
      this.pos = { x: parseInt(pos.x), y: parseInt(pos.y)};
      this.update();
      this.app.when.move();
    },

    resize_by : function(size)
    {
      this.size = { width: parseInt(this.size.width) + parseInt(size.width), height: parseInt(this.size.height) + parseInt(size.height)};
      this.update();
      this.app.when.resize();
    },

    resize_to : function(size)
    {
      this.size = { width: parseInt(size.width), height: parseInt(size.height)};
      this.update();
      this.app.when.resize();
    },

    align : function()
    {
      var target_pos = this.pos;
      target_pos.x = (parseInt(this.pos.x / 30) * 30);
      target_pos.y = (parseInt(this.pos.y / 30) * 30);
      $(this.app.el).animate({ left: target_pos.x+"px", top: target_pos.y+"px" }, 300);
      this.pos = target_pos;
    },

    set_theme : function(theme_name)
    {
      this.theme = theme_name;
      this.app.el.className = theme_name;
    },
    
    update : function(animate = true)
    {
      if(animate){
        $(this.app.el).animate({ left: this.pos.x, top: this.pos.y }, this.speed);
        $(this.app.el).animate({ width: this.size.width, height: this.size.height }, this.speed);  
      }
      else{
        $(this.app.el).css("left",this.pos.x).css("top",this.pos.y);
        $(this.app.el).css("width",this.size.width).css("height",this.size.height);
      }
    },

    toggle : function()
    {
      if(this.is_visible == true){
        this.hide();
      }
      else{
        if(!this.app.setup.has_launched){
          this.app.setup.launch();
        }
        this.show();
      }
    },

    show : function()
    {
      if(!this.app.setup.has_launched){
        this.app.setup.launch();
      }
      if(this.app.window.is_visible == true){
        return;
      }

      $(this.app.el).removeClass("hidden");
      this.is_visible = true;
    },

    hide : function()
    {
      $(this.app.el).addClass("hidden");
      this.is_visible = false;
    },

    organize : 
    {
      app : target,

      fill : function()
      {
        this.app.window.move_to({x:30,y:30});
        this.app.window.resize_to({width:lobby.window.size.width - 120, height: lobby.window.size.height - 150});
      },

      full : function()
      {
        this.app.window.move_to({x:-30,y:-30});
        this.app.window.resize_to(lobby.window.size);
      },

      left : function()
      {
        this.app.window.move_to({x:-30,y:-30});
        this.app.window.resize_to(lobby.window.horizontal_half());
      },

      right : function()
      {
        this.app.window.move_to({x:lobby.window.center().x,y:-30});
        this.app.window.resize_to(lobby.window.horizontal_half());
      }
    }
  }
}