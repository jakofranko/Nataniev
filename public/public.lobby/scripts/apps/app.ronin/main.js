function Ronin()
{
  App.call(this);

  this.name = "ronin";
  this.window.size = {width:300,height:300};
  this.window.pos = {x:60,y:60};
  this.window.theme = "blanc";

  this.setup.includes = ["layer","methods/clear","methods/fill","methods/brush","methods/path","methods/load","methods/resize","methods/type","methods/magnet","methods/import","methods/export","methods/zoom","methods/render"];
  this.project = {};
  this.project.size = this.window.size;
  this.project.zoom = 0.25;
  this.tools = {};

  this.IO.pos = {x:300,y:30}

  this.formats = ["rin"];

  this.setup.start = function()
  {
    this.app.clear();
    this.app.window.organize.center();
    this.app.zoom(0.5)
    this.app.splash();
  }

  this.setup.ready = function()
  {
    this.app.layers = {main:new Layer("main"),preview:new Layer("preview"),guide:new Layer("guide"),cursor:new Layer("cursor")};
    
    // Setup
    for(layer_id in this.app.layers){
      var layer = this.app.layers[layer_id];
      this.app.wrapper_el.appendChild(layer.el);
      layer.setup();
    }
  }

  this.when.share = function()
  {

  }

  this.when.resize = function()
  {
    this.app.window.organize.center();
  }

  this.when.key = function(key)
  {
    if(key == "."){ this.app.zoom(this.app.project.zoom - 0.025); }
    if(key == "/"){ this.app.zoom(this.app.project.zoom + 0.025); }
  }

  this.when.file = function(file)
  {
    if (!file.type.match(/image.*/)) { return false; }

    var reader = new FileReader();
    
    reader.onload = function(event)
    {
      base_image = new Image();
      base_image.src = event.target.result;

      var width = base_image.naturalWidth;
      var height = base_image.naturalHeight;
      var pos = {x:0,y:0};
      var size = {width:width,height:height};

      lobby.apps.ronin.window.show();
      lobby.apps.ronin.resize(size);
      lobby.apps.ronin.draw_image(base_image,pos,size);
    }
    reader.readAsDataURL(file);

    return true;
  }

  this.splash = function()
  {
    lobby.apps.ronin.path("M60,60 l120,0 a60,60 0 0,1 60,60 a-60,60 0 0,1 -60,60 l-120,0 M180,180 a60,60 0 0,1 60,60");
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

  this.status = function()
  {
    return this.project.size.width+"x"+this.project.size.height+"["+parseInt(this.project.zoom * 100)+"%] <t class='right'>"+this.window.size.width+"x"+this.window.size.height+"</t>";
  }

  this.wrapper_el.addEventListener('mousedown', this.mouse_down, false);
  this.wrapper_el.addEventListener('mouseup', this.mouse_up, false);
  this.wrapper_el.addEventListener('mousemove', this.mouse_move, false);
}

lobby.summon.confirm("Ronin");