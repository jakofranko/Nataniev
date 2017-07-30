function Ronin()
{
  App.call(this);

  this.name = "ronin";
  this.size = {width:300,height:300};
  this.origin = {x:120,y:120};

  this.includes = ["layer","new","fill","brush","path","import","load","resize","type","magnet","load"];
  this.project = {};
  this.project.size = {width:600,height:600};

  this.mouse_down = function(e)
  {
    this.mouse_is_down = true;
  }

  this.mouse_move = function(e)
  {
    if(!this.mouse_is_down){ return; }

    lobby.apps.ronin.layers.main.mark(e.offsetX * 2,e.offsetY * 2);
  }
  this.mouse_up = function(e)
  {
    this.mouse_is_down = false;
  }

  this.on_launch = function()
  {
    this.new();
  }

  this.wrapper_el.addEventListener('mousedown', this.mouse_down, false);
  this.wrapper_el.addEventListener('mouseup', this.mouse_up, false);
  this.wrapper_el.addEventListener('mousemove', this.mouse_move, false);
}

lobby.install_callback("Ronin");