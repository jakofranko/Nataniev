function Instrument()
{
  var app = lobby.apps.marabu;
  var target = this;
  
  this.id = 1;
  this.name = "unknown";
  this.octave = 5;
  this.name_el = document.getElementById("instrument_name");
  this.edit_mode = false;

  this.load = function(instrument_id = 1)
  {    
    if(instrument_id == this.id){ return; }

    this.refresh();
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
    this.name = GUI.instrument().name ? GUI.instrument().name : "unnamed";

    this.name_el = document.getElementById("instrument_name");
    this.name_el.value = this.name;

    GUI.update_instr();
    GUI.update_status("Selected <b>"+(GUI.instrument().name ? GUI.instrument().name : "Instrument #"+this.id)+"</b>")
  }

  this.build = function()
  {
    var html = "";
    html += "  <div class='instrument' style='width:90px; display:inline-block; vertical-align:top; border-left:1px solid #333; padding-left:30px; margin-left:-5px; line-height:15px'>";
    html += "    <h1 class='lh30'><input id='instrument_name' type='text' size='10' value='' title='Instrument Name' class='bh fh' style='text-transform:uppercase' /> ";
    html += "      <span id='exportINSTRUMENT' title='Export .instrument' class='icon export_instrument'></span>";
    html += "      <span id='exportKIT' title='Export .kit' class='icon export_kit'></span>";
    html += "      <select id='midiInput' title='Select a MIDI source' style='margin-left: 10px; display: none'>";
    html += "        <option value=''>(select MIDI)</option>";
    html += "      </select>";
    html += "      <hr />";
    html += "    </h1>";
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
