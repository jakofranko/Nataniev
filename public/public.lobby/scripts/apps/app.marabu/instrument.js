function Instrument()
{
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
}

lobby.apps.marabu.setup.confirm("instrument");
