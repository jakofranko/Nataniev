function Diary()
{
  App.call(this);

  this.name = "diary";
  this.size = {width:300,height:120};
  this.origin = {x:0,y:420};
  this.theme = "ghost";

  this.on_launch = function()
  {
    this.refresh();
  }

  this.on_installation_complete = function()
  {
    this.ghost();
  }

  this.refresh = function()
  {
    var app = this;

    $.ajax({url: '/diary.load',
      type: 'POST', 
      data: { date:"20170101" },
      success: function(response) {
        var a = JSON.parse(response);
        app.el.innerHTML = "";
        app.el.innerHTML += app.draw(a.oscean);
        app.el.innerHTML += app.draw(a.grimgrains);
      }
    })
  }

  this.draw = function(d)
  {
    var html = "";

    html += "<yu style='position:relative; margin-bottom:0px; color:white; height:60px'>"

    var path = "";
    var svg_height = 45;
    var line_spacing = 10;
    var line_width = 8;

    for(log_id in d.logs){
      var log = d.logs[log_id];
      var bar_height = svg_height - parseInt((log/10.0) * svg_height);
      path += "M"+((line_spacing * log_id) + line_width/2)+","+svg_height+" L"+((line_spacing * log_id) + line_width/2)+","+bar_height+" ";
    }

    html += "<svg style='width:"+(line_spacing * 7)+";height:"+svg_height+"px; stroke:white; stroke-dasharray:1,1; fill:none; stroke-width:"+line_width+"; stroke-linecap:butt; margin-right:10px'><path d='"+path+"'></path></svg>";

    html += "<t class='t_thin' style='line-height:60px; font-size:45px; display:inline-block; width:50px; text-align:center; margin-right:5px'>"+parseInt(d.percentage)+"</t>";
    html += "<t style='line-height: 30px;font-size: 15px;position: absolute;top:5px'>"+(d.difference > 0 ? '+' : '')+parseInt(d.difference)+"</t>";
    html += "<t style='line-height: 30px;font-size: 15px;position: absolute;top:25px'>"+d.unit+"</t>";
    html += "</yu>";

    return html;
  }
}

lobby.install_callback("Diary");
