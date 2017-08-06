lobby.apps.ronin.methods.clear = {name:"clear",shortcut:"n"}

lobby.apps.ronin.clear = function(param)
{
  this.layers = {main:new Layer(),preview:new Layer(),guide:new Layer()};

  this.wrapper_el.innerHTML = "";

  this.window.resize_to({width:this.project.size.width/2,height:this.project.size.height/2});

  // // Setup

  for(layer_id in this.layers){
    var layer = this.layers[layer_id];
    this.wrapper_el.appendChild(layer.el);
    layer.setup(this.project.size);
  }

  // lobby.apps.ronin.fill("#ddd");
  lobby.apps.ronin.path("M60,60 l120,0 a60,60 0 0,1 60,60 a-60,60 0 0,1 -60,60 l-120,0 M180,180 a60,60 0 0,1 60,60");

  lobby.commander.update_status();
  this.window.organize.center();
}

lobby.apps.ronin.setup.confirm("methods/clear");