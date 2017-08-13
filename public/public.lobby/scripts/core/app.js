function App()
{
  App_Setup.call(this);
  App_Window.call(this);
  App_Touch.call(this);
  App_Events.call(this);

	this.name = "global";

  this.methods = {};
  this.methods.default = {name:"default",is_global:true};
  this.methods.exit = {name:"exit",is_global:true,shortcut:"w",run_shortcut:true};

	this.el = document.createElement("app");
	this.wrapper_el = document.createElement("yu"); this.wrapper_el.className = "wrapper";
	this.el.appendChild(this.wrapper_el);

  this.default = function()
  {
    this.window.show();
  }

  this.toggle = function()
  {
    this.window.toggle();
  }

  this.hint = function(value)
  {
    var html = "";
    var method = value.indexOf(".") > -1 ? value.split(".")[1].split(" ")[0] : null;

    // Autocomplete
    for(method_id in this.methods){
      if(this.methods[method_id].is_global){continue; }
      var method_name = this.methods[method_id].name;
      if(method_name.indexOf(method) > -1){
        html += "<t class='autocomplete'>"+method_name.replace(method,'')+"</t>";
        lobby.commander.autocomplete = this.name+"."+method_name+" ";
        break;
      }
    }

    if(this.methods[method]){
      return "<span class='param'> "+(this.methods[method].params ? ' > '+this.methods[method].params : ' > ')+"</span> ";
    }
    for(method_id in this.methods){
      var method = this.methods[method_id];
      if(method.is_global){ continue; }
      html += " <span class='method'>."+method_id+(method.shortcut ? '('+method.shortcut+')' :'')+"</span> ";
    }
    for(method_id in this.methods){
      var method = this.methods[method_id];
      if(!method.is_global){ continue; }
      html += " <span class='method global'>."+method_id+(method.shortcut ? '('+method.shortcut+')' :'')+"</span> ";
    }
    return html;
  }

  this.status = function()
  {
    return "Idle.";
  }

  this.title = function()
  {
    return this.name;
  }

  this.call = function(method,params = null,vessel = this.name)
  {
    var app = this;
    var url = ("http://localhost:8668/:maeve "+(vessel ? vessel+"."+method+' ' : '')+(params ? params : "")).trim().replace(/ /g, '+'); 
    console.log("Calling..",url)
    $.get(url).done(function(response){
      try {
        var a = JSON.parse(response);
      } catch(e) {
        console.log(e,response);
      }
      if(a){
        app.call_back(method,a)  
      }
      
    },"json");
  }

  this.call_back = function(m,r)
  {
    console.log(this.name+"."+m+" answered",r);
  }

  this.get_url = function(url)
  {
    var app = this;
    lobby.apps.util.log(url);
    $.get(url, function( data ){
      console.log(data);
      app.get_url_callback(url,JSON.parse(data))
    }); 
  }

  this.get_url_callback = function(url,r)
  {
    console.log(this.name+"."+url+" answered",r);
  }

  this.el.addEventListener("mousedown", this.touch.down, false);
  this.el.addEventListener("mouseup", this.touch.up, false);
  this.el.addEventListener("mousemove", this.touch.move, false);

  this.wrapper_el.addEventListener("mousedown", function(e){ e.stopPropagation(); }, false);
}

function UI_Toggle(id,name = "UNK")
{
  this.id = id;
  this.name = name;
  this.el = document.getElementById(id);
  this.value = 0;
  this.el.style.cursor = "pointer";

  var target = this;

  this.install = function()
  {
    this.el.innerHTML = this.name;
    this.update();
  }

  this.update = function()
  {
    this.el.style.color = this.value == 1 ? "#fff" : "#555";
    lobby.apps.marabu.instrument.set_control(this.id,this.value);
  }

  this.override = function(value)
  {
    this.value = value;
    this.update();
  }

  this.mouse_down = function()
  {
    target.value = target.value == 1 ? 0 : 1;
    target.update();
  }

  this.el.addEventListener("mousedown", this.mouse_down, false);
}

function UI_Choice(id,name = "UNK",choices = [])
{
  this.id = id;
  this.name = name;
  this.choices = choices;
  this.el = document.getElementById(id);
  this.el.style.width = "60px";
  this.el.style.display = "inline-block";
  this.el.style.marginRight = "10px";
  this.el.style.cursor = "pointer";

  this.index = 0;

  var target = this;

  this.install = function()
  {
    this.el.innerHTML = "!";
    this.update();
  }

  this.override = function(id)
  {
    this.index = id;
    this.update();
  }

  this.update = function()
  {
    var target = this.choices[this.index % this.choices.length];
    this.el.innerHTML = this.name+" <b>"+target+"</b>";

    lobby.apps.marabu.instrument.set_control(this.id,this.index);
  }

  this.mouse_down = function()
  {
    target.index += 1;
    target.index = target.index % target.choices.length;
    target.update();
  }

  this.el.addEventListener("mousedown", this.mouse_down, false);
}

function UI_Slider(id,name = "UNK",min = 0,max = 255)
{
  this.id = id;
  this.name = name;
  this.min = min;
  this.max = max;

  this.width = 30;

  this.el = document.getElementById(id);
  this.name_el = document.createElement("span");
  this.value_el = document.createElement("input");
  this.slide_el = document.createElement("div");

  this.is_selected = false;

  this.install = function()
  {
    this.el.setAttribute("class","slider");

    // Name Span
    this.name_el.setAttribute("class","w2 di");
    this.name_el.style.height = "15px";
    this.name_el.style.width = "30px";
    this.name_el.style.verticalAlign = "top";
    this.name_el.innerHTML = this.name;

    // Slide Div
    this.slide_el.className = "pointer";
    this.slide_el.style.height = "15px";
    this.slide_el.style.width = "30px";
    this.slide_el.style.display = "inline-block";
    this.slide_el.style.verticalAlign = "top";

    // Value Input
    this.value_el.className = "w2";
    this.value_el.style.backgroundColor = "black";
    this.value_el.style.marginLeft = "10px";
    this.value_el.value = this.min+"/"+this.max;

    this.el.appendChild(this.name_el);
    this.el.appendChild(this.slide_el);
    this.el.appendChild(this.value_el);

    this.slide_el.addEventListener("mousedown", mouse_down, false);
    this.slide_el.addEventListener("mouseup", mouse_up, false);
    this.slide_el.addEventListener("mousemove", mouse_move, false);
    this.value_el.addEventListener('input', value_update, false);

    this.value_el.addEventListener("mousedown", select, false);
  }

  this.override = function(v)
  {
    this.value = parseInt(v);
    var range = parseInt(this.max) - parseInt(this.min);
    var mar_left = (((this.value - parseInt(this.min))/parseFloat(range)) * this.width)+"px"
    this.value_el.value = this.value;
    this.save();
    this.update();
  }

  this.save = function()
  {
    var value = this.value;
    var instr = GUI.instrument();
    var ARP_CHORD = lobby.apps.marabu.instrument.get_storage("arp_chord");

    if (this.id == "arp_note1" || this.id == "arp_note2") {  // The arpeggio chord notes are combined into a single byte    
      value = id == "arp_note1" ? (instr.i[ARP_CHORD] & 15) | (value << 4) : (instr.i[ARP_CHORD] & 240) | value;
    }

    lobby.apps.marabu.instrument.set_control(this.id,this.value);
  }

  this.select = function()
  {
    this.is_selected = true;
    this.el.setAttribute("class","slider active");
  }

  this.deselect = function()
  {
    this.is_selected = false;
    this.el.setAttribute("class","slider");
    this.value_el.blur();
  }

  this.update = function()
  {
    if(parseInt(this.value_el.value) == this.min){ this.value_el.style.color = "#333"; }
    else if(parseInt(this.value_el.value) == this.max){ this.value_el.style.color = "#fff"; }
    else{ this.value_el.style.color = "#999"; }

    this.slide_el.innerHTML = "<svg class='fh' style='width:30px;height:15px; stroke-dasharray:1,1; fill:none; stroke-width:10px; stroke-linecap:butt;'><line x1='0' y1='7.5' x2='30' y2='7.5' stroke='#999'/><line x1='0' y1='7.5' x2='"+parseInt(this.percentage() * 30)+"' y2='7.5' stroke='#fff'/></svg>";
  }

  this.percentage = function()
  {
    return ((parseInt(this.value_el.value) + parseInt(this.min))/parseFloat(this.max));
  }

  function select(e)
  {
    e.target.select();
    e.preventDefault();
  }

  function value_update(e)
  {
    var id = this.parentNode.id;
    var target_obj = lobby.apps.marabu.instrument.sliders[id];
    var target_val = parseInt(target_obj.value_el.value)

    if(target_val > target_obj.max){target_val = target_obj.max; }
    if(target_val < target_obj.min){target_val = target_obj.min; }

    target_obj.value = parseInt(target_val);

    var mar_left = ((target_obj.value/parseFloat(target_obj.max)) * this.width)+"px"
    target_obj.update();
    target_obj.save();
  }

  function mouse_update(target_obj,offset)
  {
    var target_pos = offset;
    target_pos = target_pos < 0 ? 0 : target_pos;
    target_pos = target_pos > 30 ? 30 : target_pos;

    var ratio = target_pos/30.0;
    var range = parseInt(target_obj.max) - parseInt(target_obj.min);
    target_obj.value = target_obj.min + parseInt(ratio * range);

    target_obj.value_el.value = target_obj.value;
    target_obj.update();
    target_obj.save();
  }

  function mouse_down(e)
  {
    var id = this.parentNode.id;
    var target_obj = lobby.apps.marabu.instrument.sliders[id];

    e.preventDefault();
    e.stopPropagation();

    mouse_update(target_obj,e.offsetX);
    target_obj.select();
  }

  function mouse_up(e)
  {
    var id = this.parentNode.id;
    var target_obj = lobby.apps.marabu.instrument.sliders[id];

    e.preventDefault();
    e.stopPropagation();

    mouse_update(target_obj,e.offsetX);
    target_obj.deselect();
  }

  function mouse_move(e)
  {
    var id = this.parentNode.id;
    var target_obj = lobby.apps.marabu.instrument.sliders[id];
    if(!target_obj.is_selected){ return; }

    e.preventDefault();
    e.stopPropagation();

    mouse_update(target_obj,e.offsetX);
  }
}