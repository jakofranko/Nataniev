lobby.apps.ronin.methods.import = {name:"import",params:"path [width:200,height:200]",shortcut:"i",passive:true}

lobby.apps.ronin.draw_image = function(base_image,pos,size)
{
  lobby.apps.ronin.layers.main.context().drawImage(base_image, pos.x,pos.y, size.width, size.height);
}

lobby.apps.ronin.import = function(param)
{
  this.import = function(val, is_passive = false)
  {
    if(is_passive){
      lobby.commander.show_browser();
      lobby.commander.browse_candidates(val,["jpg","png"]);
      return;
    }

    this.window.show();
    lobby.commander.hide_browser();
    this.import_file(lobby.commander.select_candidate(val,["jpg","png"]));
    return val;
  }

  this.import_file = function(path)
  {
    path = path.replace("public/","");

    var position = {x:0,y:0};

    base_image = new Image();
    base_image.src = path;
    base_image.src += '?'+new Date().getTime();
    base_image.crossOrigin = "Anonymous";
    
    base_image.onload = function()
    {
      var width = base_image.naturalWidth;
      var height = base_image.naturalHeight;
      
      lobby.apps.ronin.project.size = {width:width,height:height};
      lobby.apps.ronin.clear();
      // Scale with only 1 unit
      width  = isNaN(width) && height > 0 ? (height*base_image.naturalWidth)/base_image.naturalHeight : width;
      height = isNaN(height) && width > 0 ? (width*base_image.naturalHeight)/base_image.naturalWidth : height;

      var pos = {x:0,y:0};
      var size = {width:width,height:height};

      lobby.apps.ronin.draw_image(base_image,pos,size);
    }
  }
}

lobby.apps.ronin.setup.confirm("methods/import");