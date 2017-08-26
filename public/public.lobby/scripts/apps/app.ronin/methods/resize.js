lobby.apps.ronin.methods.resize = {name:"resize",params:"w: h: s:"}

lobby.apps.ronin.resize = function(param = null,is_passive = false, redraw = false)
{
  var scale = lobby.commander.find_variable("s:",1);
  var size  = {width:lobby.commander.find_variable("w:",this.project.size.width) * scale,height:lobby.commander.find_variable("h:",this.project.size.height) * scale};

  if((lobby.commander.find_variable("w:",null) && lobby.commander.find_variable("h:",null)) || lobby.commander.find_variable("s:",null)){
    this.project.size = size;
    redraw = true;
  }

  for(layer_id in lobby.apps.ronin.layers){
    var layer = lobby.apps.ronin.layers[layer_id];
    layer.resize(this.project.size, redraw);
  }

  // Guide Layer
  this.layers.guide.resize();

  this.window.resize_to({width:this.project.size.width * this.project.zoom,height:this.project.size.height * this.project.zoom});
  lobby.commander.update_status();
}

lobby.apps.ronin.setup.confirm("methods/resize");