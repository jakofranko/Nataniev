function Diary()
{
  App.call(this);

  this.name = "diary";

  this.window.size = {width:180,height:120};
  this.window.pos = {x:0,y:0};
  this.window.theme = "ghost";

  this.methods.refresh = {name:"refresh",shortcut:"r",run_shortcut:true};

  this.payload = null;

  this.setup.start = function()
  {
    this.app.refresh();
  }

  this.refresh = function()
  {
    var app = this;
    $.ajax({url: '/diary.load',
      type: 'POST', 
      data: { date:"20170101" },
      success: function(response) {
        var a = JSON.parse(response);
        app.payload = a;
        app.wrapper_el.innerHTML = app.draw(a.oscean)+app.draw(a.grimgrains);
        lobby.commander.update_status();
      }
    })
  }

  this.draw = function(d)
  {
    var html = "";

    html += "<yu style='position:relative; margin-bottom:0px; height:60px' class='fh'>"

    var path = "";
    var svg_height = 45;
    var line_spacing = 10;
    var line_width = 8;

    for(log_id in d.logs){
      var log = d.logs[log_id];
      var bar_height = svg_height - parseInt((log/10.0) * svg_height);
      path += "M"+((line_spacing * log_id) + line_width/2)+","+svg_height+" L"+((line_spacing * log_id) + line_width/2)+","+bar_height+" ";
    }

    html += "<svg class='fh' style='width:"+(line_spacing * 7)+";height:"+svg_height+"px; stroke-dasharray:1,1; fill:none; stroke-width:"+line_width+"; stroke-linecap:butt; margin-right:10px'><path d='"+path+"'></path></svg>";

    html += "<t class='thin' style='line-height:60px; font-size:45px; display:inline-block; width:50px; text-align:center; margin-right:5px'>"+parseInt(d.percentage)+"</t>";
    html += "<t style='line-height: 30px;font-size: 15px;position: absolute;top:5px'>"+(d.difference > 0 ? '+' : '')+parseInt(d.difference)+"</t>";
    html += "<t style='line-height: 30px;font-size: 15px;position: absolute;top:25px'>"+d.unit+"</t>";
    html += "</yu>";

    return html;
  }

  this.status = function()
  {
    var html = "";

    for(project_id in this.payload){
      var project = this.payload[project_id];
      if(!project.tips){ continue; }
      html += "<b>"+project_id.toUpperCase()+"</b> > "+project.tips+" | ";
    }
    return html;
  }
}

lobby.summon.confirm("Diary");
