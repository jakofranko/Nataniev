lobby.apps.ronin.methods.import = {name:"import",params:"path x: y: w: h: s:",shortcut:"i",passive:true}

lobby.apps.ronin.draw_image = function(base_image,pos,size)
{
  lobby.apps.ronin.layers.main.context().drawImage(base_image, pos.x,pos.y, size.width, size.height);
}

lobby.apps.ronin.import = function(param)
{
  this.import = function(val, is_passive = false)
  {
    var path  = val.split(" ")[0];
    var scale = lobby.commander.find_variable("s:",1);
    var pos   = {x:lobby.commander.find_variable("x:",0),y:lobby.commander.find_variable("y:",0)};
    var size  = {width:lobby.commander.find_variable("w:",null) * scale,height:lobby.commander.find_variable("h:",null) * scale};
    
    if(is_passive){
      lobby.commander.show_browser();
      lobby.commander.browse_candidates(path,["jpg","png"]);
      return;
    }

    // Draw

    base_image = new Image();
    base_image.src = lobby.commander.select_candidate(path,["jpg","png"]).replace("public/","");
    
    base_image.onload = function()
    {
      var width = base_image.naturalWidth;
      var height = base_image.naturalHeight;

      default_width  = isNaN(width) && height > 0 ? (height*base_image.naturalWidth)/base_image.naturalHeight : width;
      default_height = isNaN(height) && width > 0 ? (width*base_image.naturalHeight)/base_image.naturalWidth : height;

      var new_size = {width:size.width ? size.width * scale : default_width * scale, height:size.height ? size.height * scale : default_height * scale};

      lobby.apps.ronin.draw_image(base_image,pos,new_size);
    }

    // Finish

    this.window.show();
    lobby.commander.hide_browser();
  }
}

lobby.apps.ronin.setup.confirm("methods/import");