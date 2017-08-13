function Instrument()
{
  var app = lobby.apps.marabu;
  var target = this;
  
  this.id = 1;
  this.name = "unknown";
  this.octave = 5;
  this.name_el = document.getElementById("instrument_name");
  this.edit_mode = false;

  this.controls = {};
  this.sliders = {};
  this.choices = {};

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
  }

  this.setup_sliders = function(sliders)
  {
    for(id in sliders){
      var slider = new Slider(sliders[id].id,sliders[id].name,sliders[id].min,sliders[id].max);
      this.sliders[new String(sliders[id].id)] = slider;
      slider.install();
    }
  }

  this.deselect_sliders = function()
  {
    for(id in this.sliders){
      this.sliders[id].deselect();
    }
  }

  this.deselect_all = function()
  {
    GUI.deselect_sliders();
    GUI.pattern_controller.deselect();
    GUI.sequence_controller.deselect();
    GUI.instrument_controller.deselect();
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

  this.get_storage = function(id)
  {
    var OSC1_WAVEFORM = 0,
      OSC1_VOL = 1,
      OSC1_SEMI = 2,
      OSC1_XENV = 3,

      OSC2_WAVEFORM = 4,
      OSC2_VOL = 5,
      OSC2_SEMI = 6,
      OSC2_DETUNE = 7,
      OSC2_XENV = 8,

      NOISE_VOL = 9,

      ENV_ATTACK = 10,
      ENV_SUSTAIN = 11,
      ENV_RELEASE = 12,

      ARP_CHORD = 13,
      ARP_SPEED = 14,

      LFO_WAVEFORM = 15,
      LFO_AMT = 16,
      LFO_FREQ = 17,
      LFO_FX_FREQ = 18,

      FX_FILTER = 19,
      FX_FREQ = 20,
      FX_RESONANCE = 21,
      FX_DIST = 22,
      FX_DRIVE = 23,
      FX_PAN_AMT = 24,
      FX_PAN_FREQ = 25,
      FX_DELAY_AMT = 26,
      FX_DELAY_TIME = 27;

    if      (id == "osc1_vol")    { return OSC1_VOL; }
    else if (id == "osc1_semi")   { return OSC1_SEMI; }
    else if (id == "noise_vol")   { return NOISE_VOL; }
    else if (id == "osc1_wave_select") { return OSC1_WAVEFORM; }

    else if (id == "osc2_vol")    { return OSC2_VOL; }
    else if (id == "osc2_semi")   { return OSC2_SEMI; }
    else if (id == "osc2_det")    { return OSC2_DETUNE; }
    else if (id == "osc2_wave_select") { return OSC2_WAVEFORM; }

    else if (id == "env_att")     { return ENV_ATTACK; }
    else if (id == "env_sust")    { return ENV_SUSTAIN; }
    else if (id == "env_rel")     { return ENV_RELEASE; }

    else if (id == "arp_note1")   { return ARP_CHORD; }
    else if (id == "arp_note2")   { return ARP_CHORD; }
    else if (id == "arp_speed")   { return ARP_SPEED; }

    else if (id == "lfo_amt")     { return LFO_AMT; }
    else if (id == "lfo_freq")    { return LFO_FREQ; }
    else if (id == "lfo_wave_select") { return LFO_WAVEFORM; }

    else if (id == "fx_filter_select")   { return FX_FILTER; }
    else if (id == "fx_freq")     { return FX_FREQ; }
    else if (id == "fx_res")      { return FX_RESONANCE; }
    else if (id == "fx_dist")     { return FX_DIST; }
    else if (id == "fx_drive")    { return FX_DRIVE; }
    else if (id == "fx_pan_amt")  { return FX_PAN_AMT; }
    else if (id == "fx_pan_freq") { return FX_PAN_FREQ; }
    else if (id == "fx_dly_amt")  { return FX_DELAY_AMT; }
    else if (id == "fx_dly_time") { return FX_DELAY_TIME; }
    return -1;
  }

  this.update_controls = function()
  {
    var OSC1_WAVEFORM = 0,
      OSC1_VOL = 1,
      OSC1_SEMI = 2,
      OSC1_XENV = 3,

      OSC2_WAVEFORM = 4,
      OSC2_VOL = 5,
      OSC2_SEMI = 6,
      OSC2_DETUNE = 7,
      OSC2_XENV = 8,

      NOISE_VOL = 9,

      ENV_ATTACK = 10,
      ENV_SUSTAIN = 11,
      ENV_RELEASE = 12,

      ARP_CHORD = 13,
      ARP_SPEED = 14,

      LFO_WAVEFORM = 15,
      LFO_AMT = 16,
      LFO_FREQ = 17,
      LFO_FX_FREQ = 18,

      FX_FILTER = 19,
      FX_FREQ = 20,
      FX_RESONANCE = 21,
      FX_DIST = 22,
      FX_DRIVE = 23,
      FX_PAN_AMT = 24,
      FX_PAN_FREQ = 25,
      FX_DELAY_AMT = 26,
      FX_DELAY_TIME = 27;
      
    var instr = GUI.instrument();
    this.sliders["osc1_vol"].override(instr.i[OSC1_VOL]);
    this.sliders["osc1_semi"].override(instr.i[OSC1_SEMI]);
    this.sliders["osc2_vol"].override(instr.i[OSC2_VOL]);
    this.sliders["osc2_semi"].override(instr.i[OSC2_SEMI]);
    this.sliders["osc2_det"].override(instr.i[OSC2_DETUNE]);
    this.sliders["noise_vol"].override(instr.i[NOISE_VOL]);

    this.sliders["env_att"].override(instr.i[ENV_ATTACK]);
    this.sliders["env_sust"].override(instr.i[ENV_SUSTAIN]);
    this.sliders["env_rel"].override(instr.i[ENV_RELEASE]);

    this.sliders["arp_note1"].override(instr.i[ARP_CHORD] >> 4);
    this.sliders["arp_note2"].override(instr.i[ARP_CHORD] & 15);
    this.sliders["arp_speed"].override(instr.i[ARP_SPEED]);

    this.sliders["lfo_amt"].override(instr.i[LFO_AMT]);
    this.sliders["lfo_freq"].override(instr.i[LFO_FREQ]);
    this.sliders["lfo_fxfreq"].override(instr.i[LFO_FX_FREQ]);

    this.sliders["fx_freq"].override(instr.i[FX_FREQ]);
    this.sliders["fx_res"].override(instr.i[FX_RESONANCE]);
    this.sliders["fx_dly_amt"].override(instr.i[FX_DELAY_AMT]);
    this.sliders["fx_dly_time"].override(instr.i[FX_DELAY_TIME]);
    this.sliders["fx_pan_amt"].override(instr.i[FX_PAN_AMT]);
    this.sliders["fx_pan_freq"].override(instr.i[FX_PAN_FREQ]);
    this.sliders["fx_dist"].override(instr.i[FX_DIST]);
    this.sliders["fx_drive"].override(instr.i[FX_DRIVE]);
  }

  this.load = function(instrument_id = 1)
  {    
    if(instrument_id == this.id){ return; }

    this.refresh();
  }

  this.set_control = function(id,value)
  {
    var storage_id = this.get_storage(id);
    GUI.instrument().i[storage_id] = value;
    console.log("set "+id+"("+storage_id+")",value);

    GUI.mJammer_update();
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
    var i = GUI.song().songData[this.id];
    console.log("Refresh Instrument",i.i);

    this.name = GUI.instrument().name ? GUI.instrument().name : "unnamed";

    this.name_el = document.getElementById("instrument_name");
    this.name_el.value = this.name;

    GUI.update_instr();
  }

  this.build = function()
  {
    var html = "";
    html += "  <div class='instrument' style='width:90px; display:inline-block; vertical-align:top; border-left:1px solid #333; padding-left:30px; margin-left:-5px; line-height:15px'>";
    html += "    <h1 class='lh30'><input id='instrument_name' type='text' size='10' value='' title='Instrument Name' class='bh fh' style='text-transform:uppercase' /><hr /></h1>";
    html += "    <div class='osc' style='width:180px; margin-bottom:15px'><t id='osc1_wave_select'>ERROR</t><t id='osc1_xenv' class='box' style='display:none'>X</t>";
    html += "      <div id='osc1_vol'></div>";
    html += "      <div id='osc1_semi'></div>";
    html += "      <div id='noise_vol'></div>";
    html += "    </div>";
    html += "    <div class='osc' style='width:180px; margin-bottom:15px'><t id='osc2_wave_select'>ERROR</t><t id='osc2_xenv' class='box' style='display:none'>?</t>";
    html += "      <div id='osc2_vol'></div>";
    html += "      <div id='osc2_semi'></div>";
    html += "      <div id='osc2_det'></div>";
    html += "    </div>";
    html += "    <div class='env' style='width:180px; margin-bottom:15px'>";
    html += "      <div id='env_att'></div>";
    html += "      <div id='env_sust'></div>";
    html += "      <div id='env_rel'></div>";
    html += "    </div>";
    html += "    <div class='arp' style='width:180px; margin-bottom:15px'>";
    html += "      <div id='arp_note1'></div>";
    html += "      <div id='arp_note2'></div>";
    html += "      <div id='arp_speed'></div>";
    html += "    </div>";
    html += "    <div class='efx' style='width:180px; margin-bottom:15px'><t id='fx_filter_select'>ERROR</t>";
    html += "      <div id='fx_freq'></div>";
    html += "      <div id='fx_res'></div>";
    html += "      <div id='fx_dly_amt'></div>";
    html += "      <div id='fx_dly_time'></div>";
    html += "      <div id='fx_pan_amt'></div>";
    html += "      <div id='fx_pan_freq'></div>";
    html += "      <div id='fx_drive'></div>";
    html += "      <div id='fx_dist'></div>";
    html += "    </div>";
    html += "    <div class='lfo' style='width:180px; margin-bottom:5px'>";
    html += "      <h1>";
    html += "        <t id='lfo_wave_select'>ERROR</t>";
    html += "      </h1>";
    html += "      <div id='lfo_amt'></div>";
    html += "      <div id='lfo_freq'></div>";
    html += "      <div id='lfo_fxfreq'></div>";
    html += "    </div>";
    html += "      <span class='status' id='instrument_controller_status' style='display:none'></span>";
    html += "  </div>";
    html += "  <div class='status' style='display:none'>";
    html += "    LOG";
    html += "    <span id='statusText'>Idle.</span>";
    html += "    <div id='exportWAV' class='icon export_wav' title='Export song as .wav'></div>";
    html += "    <div id='exportBINARY' class='icon export_binary' title='Export song as binary'></div>";
    html += "    <div id='exportJS' class='icon export_json' title='Export song as .json'></div>";
    html += "    <hr />";
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

  this.status = function()
  {
    return "INS(id:"+this.id+" octave:"+this.octave+")";
  }

  this.play = function(note)
  {
    GUI.play_note(note + this.octave * 12);
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
    }
  }
}

lobby.apps.marabu.setup.confirm("instrument");
