function Layer(name = "UNK")
{
  this.name = name;
  this.el = document.createElement("canvas");

  this.setup = function(size = lobby.apps.ronin.project.size,zoom = lobby.apps.ronin.project.zoom)
  {
    this.el.style.position = "absolute";
    this.resize(size);
  }

  this.zoom = function(zoom = lobby.apps.ronin.project.zoom)
  {
    this.el.style.width = parseInt(this.el.width * zoom)+"px";
    this.el.style.height = parseInt(this.el.height * zoom)+"px";
  }

  this.resize = function(size = lobby.apps.ronin.project.size)
  {
    this.el.width = size.width;
    this.el.height = size.height;
    this.el.style.position = "absolute";   
    this.zoom();
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

lobby.apps.ronin.setup.confirm("layer");