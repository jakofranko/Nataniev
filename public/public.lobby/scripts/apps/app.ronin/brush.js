lobby.apps.ronin.methods.brush = {name:"brush",shortcut:"b"}

lobby.apps.ronin.tools.brush =
{
  mouse_prev : null,
  mouse_size : 0,

  mouse_down : function(x,y)
  {
    this.mouse_prev = {x:x,y:y};
  },
  
  mouse_move : function(x,y)
  {
    var a = {x:x,y:y};
    var b = this.mouse_prev;
    var distance = Math.sqrt( (a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y) );
    var thickness = distance;
    var context = lobby.apps.ronin.layers.main.context();

    this.mouse_size += thickness > this.mouse_size ? 1 : -1;

    context.beginPath();
    context.moveTo(b.x,b.y);
    context.lineTo(a.x,a.y);
    context.lineCap="round";
    context.lineWidth = 15-this.mouse_size;
    context.strokeStyle = "black";
    context.stroke();
    context.closePath();

    this.mouse_prev = a;
  },
  
  mouse_up : function(x,y)
  {
    this.mouse_prev = null;
  },
}

lobby.apps.ronin.setup.confirm("brush");