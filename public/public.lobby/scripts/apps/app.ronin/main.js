function Ronin()
{
  App.call(this);

  this.name = "ronin";
  this.size = {width:795,height:450};
  this.origin = {x:60,y:60};

  this.includes = ["layer","new","fill","brush","path","load","resize","type","magnet","import","export"];
  this.project = {};
  this.project.size = this.size;
  this.tools = {};

  this.formats = ["rin"];

  this.on_launch = function()
  {
    this.new();
  }

  this.on_input_change = function(value)
  {
    if(value.split(" ")[0] == "ronin.load"){
      var val = value.split(" "); val.shift(); val = val.join(" ").trim();
      this.load(val,true);
    }
    if(value.split(" ")[0] == "ronin.import"){
      var val = value.split(" "); val.shift(); val = val.join(" ").trim();
      this.import(val,true);
    }
  }

  this.mouse_down = function(e)
  {
    this.mouse_is_down = true;

    lobby.apps.ronin.tools.brush.mouse_down(e.offsetX*2,e.offsetY*2);
  }

  this.mouse_move = function(e)
  {
    if(!this.mouse_is_down){ return; }

    lobby.apps.ronin.tools.brush.mouse_move(e.offsetX*2,e.offsetY*2);
  }

  this.mouse_up = function(e)
  {
    this.mouse_is_down = false;

    lobby.apps.ronin.tools.brush.mouse_move(e.offsetX*2,e.offsetY*2);
  }

  this.wrapper_el.addEventListener('mousedown', this.mouse_down, false);
  this.wrapper_el.addEventListener('mouseup', this.mouse_up, false);
  this.wrapper_el.addEventListener('mousemove', this.mouse_move, false);
}

lobby.install_callback("Ronin");