lobby.apps.ronin.methods.fill = {name:"fill"}

lobby.apps.ronin.fill = function(color)
{
  var context = this.layers.main.context();

  context.beginPath();
  context.rect(0,0,this.project.size.width,this.project.size.height);
  context.fillStyle = color;
  context.fill();
  context.closePath();
}

lobby.apps.ronin.setup.confirm("fill");