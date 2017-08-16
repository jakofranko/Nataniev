lobby.apps.ronin.methods.clear = {name:"clear",shortcut:"n"}

lobby.apps.ronin.clear = function(param)
{
  this.layers = {main:new Layer("main"),preview:new Layer("preview"),guide:new Layer("guide")};

  this.wrapper_el.innerHTML = "";

  this.window.size = {width:this.project.size.width/2,height:this.project.size.height/2};

  // // Setup

  for(layer_id in this.layers){
    var layer = this.layers[layer_id];
    this.wrapper_el.appendChild(layer.el);
    layer.setup(this.project.size,this.project.zoom);
  }

  lobby.apps.ronin.path("M60,60 l120,0 a60,60 0 0,1 60,60 a-60,60 0 0,1 -60,60 l-120,0 M180,180 a60,60 0 0,1 60,60");

  lobby.commander.update_status();
  this.window.organize.center();
}

lobby.apps.ronin.setup.confirm("methods/clear");