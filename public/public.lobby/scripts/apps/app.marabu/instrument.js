function Instrument()
{
  var app = lobby.apps.marabu;
  var target = this;
  
  this.id = 1;
  this.name = "unknown";
  this.octave = 5;
  this.name_el = document.getElementById("instrument_name");
  this.edit_mode = false;

  this.selection = {s:null,y:0};
  this.sliders = {};
  this.choices = {};
  this.toggles = {};

  this.install = function()
  {
    this.setup_sliders([
      {id: "osc1_vol", name: "VOL", min: 0, max: 255, percent: true },
      {id: "osc1_semi", name: "FRQ", min: 92, max: 164 },
      {id: "noise_vol", name: "NOI", min: 0, max: 255 },

      {id: "osc2_vol", name: "VOL", min: 0, max: 255, percent: true },
      {id: "osc2_semi", name: "FRQ", min: 92, max: 164 },
      {id: "osc2_det", name: "DET", min: 0, max: 255, percent: true, nonLinear: true },

      {id: "env_att", name: "ATK", min: 0, max: 255 },
      {id: "env_sust", name: "SUS", min: 0, max: 255 },
      {id: "env_rel", name: "REL", min: 0, max: 255 },

      {id: "arp_note1", name: "ARP", min: 0, max: 12 },
      {id: "arp_note2", name: "SEC", min: 0, max: 12 },
      {id: "arp_speed", name: "SPD", min: 0, max: 7 },

      {id: "lfo_amt", name: "AMT", min: 0, max: 255 },
      {id: "lfo_freq", name: "FRQ", min: 0, max: 254 },
      {id: "lfo_fxfreq", name: "MOD", min: 0, max: 255 },

      {id: "fx_freq", name: "FRQ", min: 0, max: 255, nonLinear: true },
      {id: "fx_res", name: "RES", min: 0, max: 254 },
      {id: "fx_dly_amt", name: "DLY", min: 0, max: 255 },
      {id: "fx_dly_time", name: "SPD", min: 0, max: 16 },
      {id: "fx_pan_amt", name: "PAN", min: 0, max: 255 },
      {id: "fx_pan_freq", name: "FRQ", min: 0, max: 16 },
      {id: "fx_dist", name: "DIS", min: 0, max: 255, nonLinear: true },
      {id: "fx_drive", name: "DRV", min: 0, max: 255 },
    ]);

    this.setup_choices([
      {id: "osc1_wave_select", name: "OSC", choices: ["SIN","SQR","SAW","TRI"]},
      {id: "osc2_wave_select", name: "OSC", choices: ["SIN","SQR","SAW","TRI"]},
      {id: "fx_filter_select", name: "EFX", choices: ["","HP","LP","BP"]},
      {id: "lfo_wave_select", name: "LFO", choices: ["SIN","SQR","SAW","TRI"]}
    ])

    this.setup_toggles([
      {id: "osc1_xenv", name: "MOD"},
      {id: "osc2_xenv", name: "MOD"},
    ]);
  }

  this.start = function()
  {
    this.name_el = document.getElementById("instrument_name");
    this.name_el.addEventListener('input', text_change, false);
  }

  this.setup_sliders = function(sliders)
  {
    for(id in sliders){
      var s = sliders[id];
      var slider = new UI_Slider(s.id,s.name,s.min,s.max);
      this.sliders[new String(s.id)] = slider;
      slider.install();
    }
  }

  this.setup_choices = function(choices)
  {
    for(id in choices){
      var c = choices[id];
      var choice = new UI_Choice(c.id,c.name,c.choices);
      this.choices[new String(c.id)] = choice;
      choice.install();
    }
  }

  this.setup_toggles = function(toggles)
  {
    for(id in toggles){
      var t = toggles[id];
      var toggle = new UI_Toggle(t.id,t.name);
      this.toggles[new String(t.id)] = toggle;
      toggle.install();
    }    
  }

  this.get_storage = function(id)
  {
    if      (id == "osc1_vol")    { return 1; }
    else if (id == "osc1_semi")   { return 2; }
    else if (id == "osc1_xenv")   { return 3; }
    else if (id == "noise_vol")   { return 9; }
    else if (id == "osc1_wave_select") { return 0; }

    else if (id == "osc2_vol")    { return 5; }
    else if (id == "osc2_semi")   { return 6; }
    else if (id == "osc2_det")    { return 7; }
    else if (id == "osc2_xenv")   { return 8; }
    else if (id == "osc2_wave_select") { return 4; }

    else if (id == "env_att")     { return 10; }
    else if (id == "env_sust")    { return 11; }
    else if (id == "env_rel")     { return 12; }

    else if (id == "arp_note1")   { return 13; }
    else if (id == "arp_note2")   { return 13; }
    else if (id == "arp_speed")   { return 14; }

    else if (id == "lfo_amt")     { return 16; }
    else if (id == "lfo_freq")    { return 17; }
    else if (id == "lfo_fxfreq") { return 18; }
    else if (id == "lfo_wave_select") { return 15; }

    else if (id == "fx_filter_select")   { return 19; }
    else if (id == "fx_freq")     { return 20; }
    else if (id == "fx_res")      { return 21; }
    else if (id == "fx_dist")     { return 22; }
    else if (id == "fx_drive")    { return 23; }
    else if (id == "fx_pan_amt")  { return 24; }
    else if (id == "fx_pan_freq") { return 25; }
    else if (id == "fx_dly_amt")  { return 26; }
    else if (id == "fx_dly_time") { return 27; }
    return -1;
  }

  function text_change(e)
  {
    var name = e.target.value;
    var inst = lobby.apps.marabu.instrument.id;
    lobby.apps.marabu.song.update_instrument_name(inst,name);
    lobby.apps.marabu.editor.refresh();
  }

  this.refresh = function()
  {
    this.update_controls();
  }

  this.select = function(id = null,slider = null)
  {
    if(id != null){
      this.id = id;      
    }
    this.selection.s = slider;
    this.refresh();
  }

  this.update_controls = function()
  {
    var instr = app.song.instrument();

    for(slider_id in this.sliders){
      var slider = this.sliders[slider_id];
      var value = instr.i[this.get_storage(slider_id)];
      slider.override(value);
    }

    for(choice_id in this.choices){
      var choice = this.choices[choice_id];
      var value = instr.i[this.get_storage(choice_id)];
      choice.override(value);
    }

    for(toggle_id in this.toggles){
      var toggle = this.toggles[toggle_id];
      var value = instr.i[this.get_storage(toggle_id)];
      toggle.override(value);
    }

    app.song.mJammer_update();
  }

  this.load = function(instrument_id = 1)
  {    
    if(instrument_id == this.id){ return; }

    this.refresh();
  }

  this.set_control = function(id,value,effect_keyframe = false)
  {
    var storage_id = this.get_storage(id);

    // Record Effect
    if(effect_keyframe){
      // console.log("Set Effect",storage_id)
      app.editor.set_effect(storage_id,value);  
    }
    // Change instrument
    else{
      // console.log("Update Instrument",storage_id)
      app.song.instrument().i[storage_id] = value;      
    }

    app.song.mJammer_update();
  }

  this.deselect = function()
  {

  }

  this.edit = function(toggle = true)
  {
    app.sequencer.edit_mode = false;
    app.editor.edit_mode = false;
    
    this.edit_mode = toggle;
  }

  this.refresh = function()
  {
    var i = app.song.song().songData[this.id];

    this.name = app.song.instrument().name ? app.song.instrument().name : "--";

    this.name_el = document.getElementById("instrument_name");
    this.name_el.value = this.name;

    this.update_controls();
  }

  this.move = function(x,y)
  {
    if(this.sliders[this.selection.s]){ this.sliders[this.selection.s].mod(x); }
  }

  this.build = function()
  {
    var html = "";
    html += "  <div class='instrument' style='width:90px; display:inline-block; vertical-align:top; border-left:1px solid #333; padding-left:30px; margin-left:-5px; line-height:15px'>";
    html += "    <h1 class='lh30' style='width:90px'><input id='instrument_name' type='text' size='4' maxLength='4' value='' title='Instrument Name' class='bh fm' style='height: 30px;line-height: 30px;text-transform: uppercase;background: transparent;font-family:\"input_mono_medium\";display: block;width:100%' /><hr /></h1>";
    html += "    <div class='env' style='width:180px; margin-bottom:15px'>";
    html += "      <div id='env_att'></div>";
    html += "      <div id='env_sust'></div>";
    html += "      <div id='env_rel'></div>";
    html += "    </div>";
    html += "    <div class='osc' style='width:180px; margin-bottom:15px'><t id='osc1_wave_select'>ERROR</t><t id='osc1_xenv'>X</t>";
    html += "      <div id='osc1_vol'></div>";
    html += "      <div id='osc1_semi'></div>";
    html += "      <div id='noise_vol'></div>";
    html += "    </div>";
    html += "    <div class='osc' style='width:180px; margin-bottom:15px'><t id='osc2_wave_select'>ERROR</t><t id='osc2_xenv'>?</t>";
    html += "      <div id='osc2_vol'></div>";
    html += "      <div id='osc2_semi'></div>";
    html += "      <div id='osc2_det'></div>";
    html += "    </div>";
    html += "    <div class='arp' style='width:180px; margin-bottom:15px'>";
    html += "      <div id='arp_note1'></div>";
    html += "      <div id='arp_note2'></div>";
    html += "      <div id='arp_speed'></div>";
    html += "    </div>";
    html += "    <div class='lfo' style='width:180px; margin-bottom:15px'>";
    html += "      <h1>";
    html += "        <t id='lfo_wave_select'>ERROR</t>";
    html += "      </h1>";
    html += "      <div id='lfo_amt'></div>";
    html += "      <div id='lfo_freq'></div>";
    html += "      <div id='lfo_fxfreq'></div>";
    html += "    </div>";
    html += "    <div class='efx' style='width:180px; margin-bottom:5px'><t id='fx_filter_select'>ERROR</t>";
    html += "      <div id='fx_freq'></div>";
    html += "      <div id='fx_res'></div>";
    html += "      <div id='fx_dly_amt'></div>";
    html += "      <div id='fx_dly_time'></div>";
    html += "      <div id='fx_pan_amt'></div>";
    html += "      <div id='fx_pan_freq'></div>";
    html += "      <div id='fx_drive'></div>";
    html += "      <div id='fx_dist'></div>";
    html += "    </div>";
    html += "  </div>";
    return html;
  }

  this.set_octave = function(mod)
  {
    this.octave += mod;
    if(this.octave > 8){ this.octave = 8; }
    if(this.octave < 1){ this.octave = 1; }
    lobby.commander.update_status();
  }

  this.play = function(note)
  {
    app.song.play_note(note + this.octave * 12);
  }

  // Keyboard Events

  this.when = 
  {
    key : function(key)
    {
      if(key == "x"){
        target.set_octave(1);
      }
      if(key == "z"){
        target.set_octave(-1);
      }
      if(key == "ArrowUp"){
        target.move(0,1);
      }
      if(key == "ArrowDown"){
        target.move(0,-1);
      }
      if(key == "]"){
        target.move(10,0);
      }
      if(key == "["){
        target.move(-10,0);
      }
      if(key == "}"){
        target.move(1,0);
      }
      if(key == "{"){
        target.move(-1,0);
      }
    }
  }
}

// UI

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
  this.value_el = document.createElement("t");
  this.slide_el = document.createElement("div");

  this.value_el.style.backgroundColor = "transparent";

  this.is_selected = false;

  this.install = function()
  {
    this.el.setAttribute("class","slider");

    // Name Span
    this.name_el.className = "name";
    this.name_el.innerHTML = this.name;

    // Slide Div
    this.slide_el.className = "pointer";
    this.slide_el.style.height = "15px";
    this.slide_el.style.width = "30px";
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

    lobby.apps.marabu.instrument.select(null,self.id);
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

    this.el.className = lobby.apps.marabu.instrument.selection.s == this.id ? "slider selected" : "slider";
    this.slide_el.innerHTML = "<svg class='fh' style='width:30px;height:15px; stroke-dasharray:1,1; fill:none; stroke-width:1px; stroke-linecap:butt;'><line x1='0' y1='7.5' x2='30' y2='7.5' class='fl'/><line x1='0' y1='7.5' x2='"+parseInt(perc * 30)+"' y2='7.5' class='fh'/></svg>";
    this.value_el.textContent = this.value;

    if(this.value == this.min){ this.value_el.className = "fl "; }
    else if(this.value == this.max){ this.value_el.className = "fh "; }
    else{ this.value_el.className = "fm "; }
  }

  this.mod = function(mod)
  {
    this.override(this.value + mod, true);
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
}


lobby.apps.marabu.setup.confirm("instrument");


