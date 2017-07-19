function Clock()
{
	App.call(this);

  this.name = "clock";
  this.size = {width:210,height:210};
  this.origin = {x:120,y:120};
  this.widget_el = document.createElement("t");

  this.radius = 90;
  this.circ = this.radius * 2 * Math.PI;
  this.center = 105;

  this.face = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  this.needle_1 = document.createElementNS("http://www.w3.org/2000/svg","circle");
  this.needle_2 = document.createElementNS("http://www.w3.org/2000/svg","circle");
  this.needle_3 = document.createElementNS("http://www.w3.org/2000/svg","circle");
  this.needle_4 = document.createElementNS("http://www.w3.org/2000/svg","circle");
  this.needle_5 = document.createElementNS("http://www.w3.org/2000/svg","circle");
  this.needle_6 = document.createElementNS("http://www.w3.org/2000/svg","circle");

  this.circle_1 = document.createElementNS("http://www.w3.org/2000/svg","circle");
  this.circle_2 = document.createElementNS("http://www.w3.org/2000/svg","circle");

  this.display_el = document.createElement("t")
  this.display_el.setAttribute("class","pa pb pl ml")

  this.wrapper_el.appendChild(this.face);
  this.wrapper_el.appendChild(this.display_el);

  this.face.appendChild(this.circle_1);
  this.face.appendChild(this.circle_2);

  this.face.appendChild(this.needle_1);
  this.face.appendChild(this.needle_2);
  this.face.appendChild(this.needle_3);
  this.face.appendChild(this.needle_4);
  this.face.appendChild(this.needle_5);
  this.face.appendChild(this.needle_6);

  this.face.setAttributeNS(null,"width","210");
  this.face.setAttributeNS(null,"height","210");
  this.face.setAttribute("style","stroke:black; fill:none; stroke-width:14; stroke-linecap:butt;transform: rotate(90deg); stroke-dasharray:0,99999")

  this.circle_1.setAttributeNS(null,"cx",this.center);
  this.circle_1.setAttributeNS(null,"cy",this.center);
  this.circle_1.setAttributeNS(null,"r","90");
  this.circle_1.setAttributeNS(null,"stroke-dasharray","1,1");

  this.circle_2.setAttributeNS(null,"cx",this.center);
  this.circle_2.setAttributeNS(null,"cy",this.center);
  // this.circle_2.setAttributeNS(null,"r","45");
  // this.circle_2.setAttributeNS(null,"stroke-dasharray","1,1");

  this.needle_1.setAttributeNS(null,"cx",this.center);
  this.needle_1.setAttributeNS(null,"cy",this.center);
  this.needle_1.setAttributeNS(null,"r","90");

  this.needle_2.setAttributeNS(null,"cx",this.center);
  this.needle_2.setAttributeNS(null,"cy",this.center);
  this.needle_2.setAttributeNS(null,"r","75");

  this.needle_3.setAttributeNS(null,"cx",this.center);
  this.needle_3.setAttributeNS(null,"cy",this.center);
  this.needle_3.setAttributeNS(null,"r","60");

  this.needle_4.setAttributeNS(null,"cx",this.center);
  this.needle_4.setAttributeNS(null,"cy",this.center);
  this.needle_4.setAttributeNS(null,"stroke-width","1");
  this.needle_4.setAttributeNS(null,"r","45");

  this.needle_5.setAttributeNS(null,"cx",this.center);
  this.needle_5.setAttributeNS(null,"cy",this.center);
  this.needle_5.setAttributeNS(null,"stroke-width","1");
  this.needle_5.setAttributeNS(null,"r","48");

  this.needle_6.setAttributeNS(null,"cx",this.center);
  this.needle_6.setAttributeNS(null,"cy",this.center);
  this.needle_6.setAttributeNS(null,"stroke-width","1");
  this.needle_6.setAttributeNS(null,"r","42");

  this.on_launch = function()
  {
    lobby.commander.install_widget(this.widget_el);
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
    var t = this.time();
    var t_s = new String(t);
    var t_a = [t_s.substr(0,3),t_s.substr(3,3)];

    this.widget_el.innerHTML = t_a[0];

    this.update_needle(this.needle_1,t/1000000);
    this.update_needle(this.needle_2,t/100000);
    this.update_needle(this.needle_3,t/10000);
    this.update_needle(this.needle_4,t/1000);
    this.update_needle(this.needle_5,t/100);
    this.update_needle(this.needle_6,t/10);

    this.display_el.innerHTML = "<b>"+t_a[0]+"</b>:"+t_a[1];
    setTimeout(function(){ lobby.apps.clock.update(); }, 86.40);
  }

  this.update_needle = function(needle,v)
  {
    if(v > 0){
      var trim = parseInt(v);
      v -= trim;
    }
    var circ = parseFloat(needle.getAttribute("r")) * 2 * Math.PI;
    needle.setAttributeNS(null,"stroke-dasharray",(v * circ)+",999");
  }
}

lobby.install_callback("Clock");