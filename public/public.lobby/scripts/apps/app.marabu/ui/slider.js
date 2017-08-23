function UI_Slider(id,name = "UNK",min = 0,max = 255,control = null)
{
  this.id = id;
  this.name = name;
  this.min = min;
  this.max = max;
  this.control = control;

  this.el = document.getElementById(id);
  this.name_el = document.createElement("t");
  this.value_el = document.createElement("t");
  this.slide_el = document.createElement("div");

  this.install = function()
  {
    this.el.className = "slider";

    // Name Span
    this.name_el.className = "name";
    this.name_el.innerHTML = this.name;
    this.name_el.style.width = "30px";
    this.name_el.style.display = "inline-block";

    // Slide Div
    this.slide_el.className = "pointer";
    this.slide_el.style.height = "15px";
    this.slide_el.style.width = "45px";
    this.slide_el.style.display = "inline-block";
    this.slide_el.style.verticalAlign = "top";

    // Value Input
    this.value_el.className = "w2";
    this.value_el.style.marginLeft = "10px";
    this.value_el.textContent = this.min+"/"+this.max;

    this.el.appendChild(this.name_el);
    this.el.appendChild(this.slide_el);
    this.el.appendChild(this.value_el);

    this.el.addEventListener("mousedown", this.mouse_down, false);
  }

  var self = this;

  this.mouse_down = function(e)
  {
    e.preventDefault();
    document.activeElement.blur();
    lobby.apps.marabu.instrument.select(self.id);
  }

  this.override = function(v,is_keyframe = false)
  {
    this.value = parseInt(v);
    if(this.value < this.min){ this.value = this.min; }
    if(this.value > this.max){ this.value = this.max; }
    this.save(is_keyframe);
    this.refresh();
  }

  this.refresh = function()
  {
    var val = parseInt(this.value) - parseInt(this.min);
    var over = parseFloat(this.max) - parseInt(this.min);
    var perc = val/parseFloat(over);

    this.slide_el.innerHTML = "<svg class='fh' style='width:45px;height:15px; stroke-dasharray:1,1; fill:none; stroke-width:1px; stroke-linecap:butt;'><line x1='0' y1='7.5' x2='45' y2='7.5' class='fl'/><line x1='0' y1='7.5' x2='"+parseInt(perc * 45)+"' y2='7.5' class='fh'/></svg>";
    this.value_el.textContent = this.value;

    if(this.value == this.min){ this.value_el.className = "fl "; }
    else if(this.value == this.max){ this.value_el.className = "fh "; }
    else{ this.value_el.className = "fm "; }
  }

  this.mod = function(mod)
  {
    this.override(this.value + mod, (lobby.apps.marabu.editor.selection.e >= 0));
  }

  this.save = function(is_keyframe = false)
  {
    var value = this.value;
    var instr = lobby.apps.marabu.song.instrument();
    var ARP_CHORD = lobby.apps.marabu.instrument.get_storage("arp_chord");

    if (this.id == "arp_note1" || this.id == "arp_note2") {  // The arpeggio chord notes are combined into a single byte    
      value = id == "arp_note1" ? (instr.i[ARP_CHORD] & 15) | (value << 4) : (instr.i[ARP_CHORD] & 240) | value;
    }

    lobby.apps.marabu.instrument.set_control(this.id,this.value,is_keyframe);
  }

  this.update = function()
  {
    var app = lobby.apps.marabu;
    this.el.className = app.selection.control == this.control ? "slider bl" : "slider";
    this.name_el.className = app.selection.control == this.control ? "fh" : "fm";
  }
}

lobby.apps.marabu.setup.confirm("ui/slider");
