lobby.apps.ronin.methods.path = {name:"path"}

lobby.apps.ronin.path = function(stroke)
{
  var context = this.layers.main.context();

  context.beginPath();
  context.lineCap = "square";
  context.lineWidth = 28;
  context.strokeStyle = "black";
  context.stroke(new Path2D(stroke));
  context.closePath();
}

lobby.apps.ronin.setup.confirm("methods/path");