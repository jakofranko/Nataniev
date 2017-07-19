function Clock()
{
	App.call(this);

  this.name = "clock";
  this.size = {width:210,height:210};
  this.origin = {x:120,y:120};
  this.widget_el = document.createElement("t"); this.widget_el.className = "toggle";

  this.radius = 90;
  this.circ = this.radius * 2 * Math.PI;
  this.center = 105;

  this.on_start = function()
  {
    lobby.commander.install_widget(this.widget_el);
    lobby.apps.clock.update();

    var app = this;
    this.widget_el.addEventListener("mousedown", function(){ app.toggle() }, true);
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

    var target   = t_a[0]+(this.is_visible ? ":"+t_a[1] : '');

    if(this.widget_el.innerHTML != target){
      this.widget_el.innerHTML = target;
    }    
  }

  this.redraw_app = function()
  {
    if(!this.is_visible){ return; }

    var t        = this.time();
    var t_s      = new String(t);
    var t_a      = [t_s.substr(0,3),t_s.substr(3,3)];
    var w        = this.size.width;
    var h        = this.size.height;
    var needle_1 = parseInt(((t/1000000) % 1) * w);
    var needle_2 = parseInt(((t/100000) % 1) * h);
    var needle_3 = needle_1 + parseInt(((t/10000) % 1) * (w - needle_1));
    var needle_4 = needle_2 + parseInt(((t/10000) % 1) * (h - needle_2));
    var needle_5 = needle_3 + parseInt(((t/1000) % 1) * (w - needle_3));
    var needle_6 = needle_4 + parseInt(((t/100) % 1) * (h - needle_4));

    var n_1_el = '<line x1="'+needle_1+'" x2="'+needle_1+'" y1="0" y2="'+h+'"></line>';
    var n_2_el = '<line x1="'+needle_1+'" x2="'+w+'" y1="'+needle_2+'" y2="'+needle_2+'"></line>';
    var n_3_el = '<line x1="'+needle_3+'" x2="'+needle_3+'" y1="'+needle_2+'" y2="'+h+'"></line>';
    var n_4_el = '<line x1="'+needle_3+'" x2="'+w+'" y1="'+needle_4+'" y2="'+needle_4+'"></line>';
    var n_5_el = '<line x1="'+needle_5+'" x2="'+needle_5+'" y1="'+needle_4+'" y2="'+h+'"></line>';
    var n_6_el = '<line x1="'+needle_5+'" x2="'+w+'" y1="'+needle_6+'" y2="'+needle_6+'"></line>';

    this.widget_el.innerHTML = t_a[0]+":"+t_a[1];
    this.wrapper_el.innerHTML = '<svg width="'+w+'" height="'+h+'" style="stroke:black; fill:none; stroke-width:1; stroke-linecap:butt;outline-color: black;outline-width: 1px;outline-offset: -1px;outline-style:solid">'+n_1_el+''+n_2_el+''+n_3_el+''+n_4_el+''+n_5_el+''+n_6_el+'</svg>';
  }

  this.on_resize = function()
  {
    this.redraw_app();
  }
}

lobby.install_callback("Clock");