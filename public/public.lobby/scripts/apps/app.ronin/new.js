lobby.apps.ronin.methods.new = {name:"new",shortcut:"n"}

lobby.apps.ronin.new = function(param)
{
  this.layers = {main:new Layer(),preview:new Layer(),guide:new Layer()};

  this.wrapper_el.innerHTML = "";

  this.resize_window_to(this.project.size.width/2,this.project.size.height/2)

  // Setup

  for(layer_id in this.layers){
    var layer = this.layers[layer_id];
    this.wrapper_el.appendChild(layer.el);
    layer.setup(this.project.size);
  }

  // lobby.apps.ronin.fill("#ccc");
  // lobby.apps.ronin.path("M60,60 l120,0 a60,60 0 0,1 60,60 a-60,60 0 0,1 -60,60 l-120,0 M180,180 a60,60 0 0,1 60,60");
}