function Layer(name = "UNK")
{
  this.name = name;
  this.el = document.createElement("canvas");
  this.preserve = false;

  this.setup = function(size = lobby.apps.ronin.project.size,zoom = lobby.apps.ronin.project.zoom)
  {
    this.el.style.position = "absolute";
    this.resize(size);
  }

  this.zoom = function(zoom = lobby.apps.ronin.project.zoom)
  {
    this.el.style.width = parseInt(this.el.width * zoom)+"px";
    this.el.style.height = parseInt(this.el.height * zoom)+"px";

    if(this.preserve){
      this.el.width = parseInt(lobby.apps.ronin.project.size.width * zoom) * 2;
      this.el.height = parseInt(lobby.apps.ronin.project.size.height * zoom) * 2;
      this.el.style.width = parseInt(lobby.apps.ronin.project.size.width * zoom)+"px";
      this.el.style.height = parseInt(lobby.apps.ronin.project.size.height * zoom)+"px";
    }
  }

  this.clear = function()
  {
    this.context().clearRect(0, 0, this.el.width, this.el.height);
  }

  this.resize = function(size = lobby.apps.ronin.project.size,redraw = true)
  {
    var ctx = this.context();
    var content = new Image();

    if(redraw == true){
      content.src = this.el.toDataURL('image/png');
    }

    this.el.width = size.width;
    this.el.height = size.height;
    this.el.style.position = "absolute";   
    this.zoom();

    content.onload = function(){
      ctx.drawImage(content,0,0,size.width,size.height);  
    }

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

  this.hint = function(pos,size) // ronin.import 1 w:50 h:50 x:10 y:10
  {
    this.clear();

    this.context().beginPath();

    this.context().rect(pos.x,pos.y,size.width,size.height);
    this.context().lineCap="square";
    this.context().lineWidth = 3;
    this.context().strokeStyle = "#000";
    this.context().stroke();

    this.context().rect(pos.x,pos.y,size.width,size.height);
    this.context().lineCap="square";
    this.context().lineWidth = 1;
    this.context().strokeStyle = "#fff";
    this.context().stroke();

    this.context().closePath();
  }
}

lobby.apps.ronin.setup.confirm("layer");