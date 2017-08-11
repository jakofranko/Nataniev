function Slider(id,name = "UNK",min = 0,max = 255)
{
  this.id = id;
  this.name = name;
  this.min = min;
  this.max = max;

  this.width = 60;

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
    
    console.log("Installed",this.id);
  }

  this.override = function(v)
  {
    this.value = parseInt(v);
    var range = parseInt(this.max) - parseInt(this.min);
    var mar_left = (((this.value - parseInt(this.min))/parseFloat(range)) * this.width)+"px"
    this.value_el.value = this.value;
    this.update();
  }

  this.save = function()
  {
    GUI.update_instrument(GUI.get_storage(this.id),this.value,this.id);
  }

  this.select = function()
  {
    GUI.deselect_all();
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

    GUI.update_status("Updated <b>"+this.id+"</b> to "+this.value+"/"+this.max);

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
    var target_obj = GUI.sliders[id];
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
    console.log(offset);
    var target_pos = offset-15;
    target_pos = target_pos < 0 ? 0 : target_pos;
    target_pos = target_pos > 115 ? 60 : target_pos;

    var ratio = target_pos/60.0;
    var range = parseInt(target_obj.max) - parseInt(target_obj.min);
    target_obj.value = target_obj.min + parseInt(ratio * range);

    target_obj.value_el.value = target_obj.value;
    target_obj.update();
    target_obj.save();
  }

  function mouse_down(e)
  {
    var id = this.parentNode.id;
    var target_obj = GUI.sliders[id];

    mouse_update(target_obj,e.layerX);
    target_obj.select();
  }

  function mouse_up(e)
  {
    var id = this.parentNode.id;
    var target_obj = GUI.sliders[id];

    mouse_update(target_obj,e.layerX);
    target_obj.deselect();
    GUI.pattern_controller.deselect_mod();
  }

  function mouse_move(e)
  {
    var id = this.parentNode.id;
    var target_obj = GUI.sliders[id];
    if(!target_obj.is_selected){ return; }
    mouse_update(target_obj,e.layerX);
  }
}

lobby.apps.marabu.setup.confirm("gui/gui.slider");


