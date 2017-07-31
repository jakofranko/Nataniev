function Layer(size)
{
  this.el = document.createElement("canvas");

  this.setup = function(size)
  {
    this.el.width = size.width * 2;
    this.el.height = size.height * 2;
    this.el.style.width = size.width+"px";
    this.el.style.height = size.height+"px";
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