function App_IO()
{
  var target = this;

  this.IO = 
  {
    routes : [],
    pos : {x:0,y:0},

    sprite : function()
    { 
      var html = "";

      html += "<text x='"+(this.pos.x + 15)+"' y='"+(this.pos.y + 3)+"'>"+target.name+"</text>"; 

      // In Ports
      var count = 0;
      for(method_id in target.methods){
        var ver_pos = this.pos.y + 30 + (count * 15);
        var hor_pos = this.pos.x;
        html += "<text x='"+(hor_pos + 15)+"' y='"+(ver_pos + 3)+"'>in_"+method_id+"</text>"; 
        html += "<circle cx='"+hor_pos+"' cy='"+ver_pos+"' r='3.5'/>"  
        count += 1;
      }

      // Out Ports
      var count = 0;
      for(event_id in target.when){
        var ver_pos = this.pos.y + 30 + (count * 15);
        var hor_pos = this.pos.x + 120;
        html += "<text x='"+(hor_pos + 15)+"' y='"+(ver_pos + 3)+"'>out_"+event_id+"</text>"; 
        html += "<circle cx='"+(hor_pos)+"' cy='"+ver_pos+"' r='2.5' fill='none' stroke='black' stroke-width='2'/>"  
        count += 1;
      }
      return html;
    },

    route : function(out_event,app,in_method)
    {
      this.routes.push({event:out_event,to:app,method:in_method});
    }
  }
}