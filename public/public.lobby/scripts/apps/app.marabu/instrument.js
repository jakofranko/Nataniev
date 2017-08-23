function Instrument()
{
  var app = lobby.apps.marabu;
  var target = this;
  
  this.id = 1;
  this.name = "unknown";
  this.title_el = null;
  this.edit_mode = false;

  this.selection = {s:null,y:0};
  this.sliders = {};
  this.choices = {};
  this.toggles = {};

  this.start = function()
  {
    console.log("Started Instrument");

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
      {id: "fx_filter_select", name: "EFX", choices: [null,"HP","LP","BP"]},
      {id: "lfo_wave_select", name: "LFO", choices: ["SIN","SQR","SAW","TRI"]}
    ])

    this.setup_toggles([
      {id: "osc1_xenv", name: "MOD"},
      {id: "osc2_xenv", name: "MOD"},
    ]);

    this.title_el = document.getElementById("instrument_name");
    this.title_el.addEventListener('input', this.text_change, false);
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

  this.text_change = function(e)
  {
    e.preventDefault();
    e.stopPropagation();
    var name = e.target.value;
    if(name.length < 4){ return; }
    app.song.inject_instrument(app.selection.instrument,"name",name);
    app.update();
  }

  this.update = function()
  {
    this.title_el.value = app.song.instrument().name;

    for(slider_id in this.sliders){
      var slider = this.sliders[slider_id];
      var value = app.song.instrument().i[this.get_storage(slider_id)];
      slider.override(value);
    }

    for(choice_id in this.choices){
      var choice = this.choices[choice_id];
      var value = app.song.instrument().i[this.get_storage(choice_id)];
      choice.override(value);
    }

    for(toggle_id in this.toggles){
      var toggle = this.toggles[toggle_id];
      var value = app.song.instrument().i[this.get_storage(toggle_id)];
      toggle.override(value);
    }

    app.song.mJammer_update();
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
}

lobby.apps.marabu.setup.confirm("instrument");


