lobby.apps.ronin.methods.resize = {name:"resize"}

lobby.apps.ronin.resize = function(param)
{
  if(!param.width && param.indexOf("x") == -1){ console.log("Invalid"); return; }

  var size = param.width ? param : {width:parseInt(param.split("x")[0]),height:parseInt(param.split("x")[1])};

  this.project.size = size;
  
  for(layer_id in lobby.apps.ronin.layers){
    var layer = lobby.apps.ronin.layers[layer_id];
    layer.resize(this.project.size,this.project.zoom);
  }
  
  this.window.resize_to({width:this.project.size.width * this.project.zoom,height:this.project.size.height * this.project.zoom});
  lobby.commander.update_status();
}

lobby.apps.ronin.setup.confirm("methods/resize");