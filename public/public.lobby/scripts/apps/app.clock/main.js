function Clock()
{
	App.call(this);

  this.name = "clock";

  this.window.size = {width:210,height:210};
  this.window.pos = {x:120,y:120};

  this.widget_el = document.createElement("t"); this.widget_el.className = "toggle";

  this.radius = 90;
  this.circ = this.radius * 2 * Math.PI;
  this.center = 105;

  this.setup.ready = function()
  {
    lobby.commander.install_widget(this.app.widget_el);

    var app = this.app;
    app.widget_el.addEventListener("mousedown", function(){ app.window.toggle() }, true);

    lobby.apps.clock.update();
  }

  this.time = function()
  {
    var d = new Date(), e = new Date(d);
    var msSinceMidnight = e - d.setHours(0,0,0,0);
    var val = (msSinceMidnight/864) * 10;
    return parseInt(val);
  }

  this.update = function()
  {
    this.redraw_app();
    this.redraw_widget();

    setTimeout(function(){ lobby.apps.clock.update(); }, 86.40);
  }

  this.redraw_widget = function()
  {
    var t        = this.time();
    var t_s      = new String(t);
    var t_a      = [t_s.substr(0,3),t_s.substr(3,3)];

    var target   = t_a[0]+(this.window.is_visible ? ":"+t_a[1] : '');

    if(this.widget_el.innerHTML != target){
      this.widget_el.innerHTML = target;
    }    
  }

  this.redraw_app = function()
  {
    if(!this.window.is_visible){ return; }

    var t        = this.time();
    var t_s      = new String(t);
    var t_a      = [t_s.substr(0,3),t_s.substr(3,3)];
    var w        = this.window.size.width;
    var h        = this.window.size.height;
    var needle_1 = parseInt(((t/1000000) % 1) * w);
    var needle_2 = parseInt(((t/100000) % 1) * h);
    var needle_3 = needle_1 + parseInt(((t/10000) % 1) * (w - needle_1));
    var needle_4 = needle_2 + parseInt(((t/10000) % 1) * (h - needle_2));
    var needle_5 = needle_3 + parseInt(((t/1000) % 1) * (w - needle_3));
    var needle_6 = needle_4 + parseInt(((t/100) % 1) * (h - needle_4));

    var path = "";
    path += "M"+needle_1+","+0+" L"+needle_1+","+h+" ";
    path += "M"+needle_1+","+needle_2+" L"+w+","+needle_2+" ";
    path += "M"+needle_3+","+needle_2+" L"+needle_3+","+h+" ";
    path += "M"+needle_3+","+needle_4+" L"+w+","+needle_4+" ";
    path += "M"+needle_5+","+needle_4+" L"+needle_5+","+h+" ";
    path += "M"+needle_5+","+needle_6+" L"+w+","+needle_6+" ";

    // Outline
    path += "M0.5,0.5 L"+(w-0.5)+",0.5 ";
    path += "M0.5,0.5 L0.5,"+(h-0.5)+" ";
    path += "M"+(w-0.5)+","+(h-0.5)+" L0.5,"+(h-0.5)+" ";
    path += "M"+(w-1)+","+(h-0.5)+" L"+(w-1)+",0.5 ";

    this.widget_el.innerHTML = t_a[0]+":"+t_a[1];
    this.wrapper_el.innerHTML = '<svg width="'+w+'" height="'+h+'" style="fill:none; stroke-width:1; stroke-linecap:butt;"><path class="fh" d="'+path+'"></path></svg>';
  }

  this.on_resize = function()
  {
    this.redraw_app();
  }
}

lobby.summon.confirm("Clock");
