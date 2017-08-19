lobby.apps.ronin.methods.zoom = {name:"zoom"}

lobby.apps.ronin.zoom = function(param)
{
  this.project.zoom = parseFloat(param);
  
  for(layer_id in lobby.apps.ronin.layers){
    var layer = lobby.apps.ronin.layers[layer_id];
    layer.zoom(this.project.zoom);
  }
  
  this.window.resize_to({width:this.project.size.width * this.project.zoom,height:this.project.size.height * this.project.zoom});  
  lobby.commander.update_status();
}

lobby.apps.ronin.setup.confirm("methods/zoom");