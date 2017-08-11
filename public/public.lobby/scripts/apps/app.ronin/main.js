function Layer(size)
{
  this.el = document.createElement("canvas");

  this.setup = function(size)
  {
    this.el.width = size.width;
    this.el.height = size.height;
    this.el.style.width = (size.width/2)+"px";
    this.el.style.height = (size.height/2)+"px";
    this.el.style.position = "absolute";
  }

  this.context = function()
  {
    return this.el.getContext('2d');
  }

  this.mark = function(x,y)
  {
    this.context().beginPath();
    this.context().rect(x,y,2,2);
    this.context().fillStyle = "red";
    this.context().fill();
    this.context().closePath();
  }
}

function Ronin()
{
  App.call(this);

  this.name = "ronin";
  this.window.size = {width:300,height:300};
  this.window.pos = {x:60,y:60};

  this.setup.includes = ["methods/clear","methods/fill","methods/brush","methods/path","methods/load","methods/resize","methods/type","methods/magnet","methods/import","methods/export"];
  this.project = {};
  this.project.size = this.window.size;
  this.project.zoom = 2;
  this.tools = {};

  this.formats = ["rin"];

  this.setup.start = function()
  {
    this.app.clear();
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

      lobby.apps.ronin.draw_image(base_image,pos,size);
    }
    reader.readAsDataURL(file);

    return true;
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
    return this.project.size.width+"x"+this.project.size.height+"[*"+this.project.zoom+"]";
  }

  this.wrapper_el.addEventListener('mousedown', this.mouse_down, false);
  this.wrapper_el.addEventListener('mouseup', this.mouse_up, false);
  this.wrapper_el.addEventListener('mousemove', this.mouse_move, false);
}

lobby.summon.confirm("Ronin");