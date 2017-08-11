
var GUI = null;
var keyboard = null;

function Marabu()
{
	App.call(this);

  this.name = "marabu";

  this.window.size = {width:780,height:510};
  this.window.pos = {x:30,y:30};
  this.window.theme = "noir";

  this.setup.includes = [
    "core/common",
    "core/demo-songs",
    "core/jammer",
    "core/keyboard",
    "core/player-small",
    "core/player-worker",
    "core/player",
    "core/rle",

    "gui/gui",
    "gui/gui.slider",

    "inc/Blob",
    "inc/deflate",
    "inc/FileSaver",
    "inc/inflate",

    "controllers/controller",
    "controllers/instrument_controller",
    "controllers/pattern_controller",
    "controllers/sequence_controller"
  ];

  this.setup.start = function()
  {
    this.app.wrapper_el.innerHTML = this.app.draw();
    gui_init();
  }

  this.draw = function()
  {
    var html = "";

    html += "<style>";
    html += ".everything { color:white; }";
    html += ".tracks tr {  line-height:15px}";
    html += ".tracks tr td { width:15px; text-align:center}";
    html += "</style>";

    html += "  <div class='sequencer' id='sequence_controller' style='width:150px; display:inline-block; vertical-align:top'>";
    html += "    <h1 class='title'>SEQ";
    html += "      <span class='status' id='sequence_controller_status'></span>";
    html += "      <input id='bpm' type='text' size='3' value='' title='Beats per minute (song speed)'/>";
    html += "      <span id='sequencerCopy' class='icon copy hide'></span>";
    html += "      <span id='sequencerPaste' class='icon paste hide'></span>";
    html += "      <span id='sequencerPatDown' class='icon remove hide'></span>";
    html += "      <span id='sequencerPatUp' class='icon add hide'></span>";
    html += "      <span id='playSong' class='icon play_song' title='Play song'></span>";
    html += "      <span id='stopPlaying' class='icon play_stop hide' title='Stop playing'></span>";
    html += "      <span class='icon recording'></span>";
    html += "      <hr/>";
    html += "    </h1>";
    html += "    <div id='sequencer' title='Enter pattern numbers, 0-9'>";
    html += "      <table class='tracks' id='sequencer-table'></table>";
    html += "    </div>";
    html += "  </div>";
    html += "  <div class='pattern' id='pattern_controller' style='width:105px; display:inline-block; vertical-align:top; border-left:1px solid #333; padding-left:30px; margin-left:-5px'>";
    html += "    <h1 class='title'>PAT";
    html += "      <span class='status' id='pattern_controller_status'></span>";
    html += "      <input id='rpp' type='text' size='3' value='' title='Rows per pattern' />";
    html += "      <span id='playRange' class='icon play_range' title='Play selected range (SPACE)'></span>";
    html += "      <span class='icon recording'></span>";
    html += "      <hr />";
    html += "    </h1>";
    html += "    <div id='pattern' style='float:left'>";
    html += "      <table class='tracks' id='pattern-table' title='Use the piano or keyboard to enter notes'></table>";
    html += "    </div>";
    html += "    <div id='fxtrack'>";
    html += "      <table class='tracks' id='fxtrack-table' title='Use instrument and effect controls to edit'></table>";
    html += "    </div>";
    html += "  </div>";
    html += "  <div class='effects hide' style='display:none'>";
    html += "    <h1>MOD";
    html += "      <span id='fxCopy' class='icon copy'></span>";
    html += "      <span id='fxPaste' class='icon paste'></span>";
    html += "      <hr />";
    html += "    </h1>";
    html += "  </div>";
    html += "  <div class='instrument' style='width:300px; display:inline-block; vertical-align:top; border-left:1px solid #333; padding-left:30px; margin-left:-5px'>";
    html += "    <h1 class='title'>INS ";
    html += "      <span class='status' id='instrument_controller_status'></span>";
    html += "      <input id='instrument_name' type='text' size='20' value='' title='Instrument Name' />";
    html += "      <span id='exportINSTRUMENT' title='Export .instrument' class='icon export_instrument'></span>";
    html += "      <span id='exportKIT' title='Export .kit' class='icon export_kit'></span>";
    html += "      <select id='midiInput' title='Select a MIDI source' style='margin-left: 10px; display: none'>";
    html += "        <option value=''>(select MIDI)</option>";
    html += "      </select>";
    html += "      <hr />";
    html += "    </h1>";
    html += "    <div class='osc'>";
    html += "      <h1>OSC1";
    html += "        <img id='osc1_wave_saw' title='Saw' src='media/graphics/wave_saw.svg' alt='Saw' />";
    html += "        <img id='osc1_wave_sqr' title='Square' src='media/graphics/wave_sqr.svg' alt='Sqr' />";
    html += "        <img id='osc1_wave_tri' title='Triangle' src='media/graphics/wave_tri.svg' alt='Tri' />";
    html += "        <img id='osc1_wave_sin' title='Sine' src='media/graphics/wave_sin.svg' alt='Sin' />";
    html += "        <img id='osc1_xenv' class='box' src='media/graphics/toggle_off.svg' width='10' height='12' alt='' />";
    html += "      </h1>";
    html += "      <div id='osc1_vol'></div>";
    html += "      <div id='osc1_semi'></div>";
    html += "      <div id='noise_vol'></div>";
    html += "    </div>";
    html += "    <div class='osc'>";
    html += "      <h1>OSC2";
    html += "        <img id='osc2_wave_saw' title='Saw' src='media/graphics/wave_saw.svg' alt='Saw' />";
    html += "        <img id='osc2_wave_sqr' title='Square' src='media/graphics/wave_sqr.svg' alt='Sqr' />";
    html += "        <img id='osc2_wave_tri' title='Triangle' src='media/graphics/wave_tri.svg' alt='Tri' />";
    html += "        <img id='osc2_wave_sin' title='Sine' src='media/graphics/wave_sin.svg' alt='Sin' />";
    html += "        <img id='osc2_xenv' class='box' src='media/graphics/toggle_off.svg' width='10' height='12' alt='' />";
    html += "      </h1>";
    html += "      <div id='osc2_vol'></div>";
    html += "      <div id='osc2_semi'></div>";
    html += "      <div id='osc2_det'></div>";
    html += "    </div>";
    html += "    <div class='env'>";
    html += "      <h1>ENV</h1>";
    html += "      <div id='env_att'></div>";
    html += "      <div id='env_sust'></div>";
    html += "      <div id='env_rel'></div>";
    html += "    </div>";
    html += "    <div class='arp'>";
    html += "      <h1>ARP</h1>";
    html += "      <div id='arp_note1'></div>";
    html += "      <div id='arp_note2'></div>";
    html += "      <div id='arp_speed'></div>";
    html += "    </div>";
    html += "    <div class='efx'>";
    html += "      <h1>EFX";
    html += "        <img id='fx_filt_lp' src='media/graphics/wave_lp.svg' alt='Saw' />";
    html += "        <img id='fx_filt_bp' src='media/graphics/wave_bp.svg' alt='Saw' />";
    html += "        <img id='fx_filt_hp' src='media/graphics/wave_hp.svg' alt='Saw' />";
    html += "      </h1>";
    html += "      <div id='fx_freq'></div>";
    html += "      <div id='fx_res'></div>";
    html += "      <div id='fx_dly_amt'></div>";
    html += "      <div id='fx_dly_time'></div>";
    html += "      <div id='fx_pan_amt'></div>";
    html += "      <div id='fx_pan_freq'></div>";
    html += "    </div>";
    html += "    <div class='lfo'>";
    html += "      <h1>LFO";
    html += "        <img id='lfo_wave_saw' title='Saw' src='media/graphics/wave_saw.svg' alt='Saw' style='margin-right: 10px' />";
    html += "        <img id='lfo_wave_sqr' title='Square' src='media/graphics/wave_sqr.svg' alt='Sqr' />";
    html += "        <img id='lfo_wave_tri' title='Triangle' src='media/graphics/wave_tri.svg' alt='Tri' style='margin-right: 10px' />";
    html += "        <img id='lfo_wave_sin' title='Sine' src='media/graphics/wave_sin.svg' alt='Sin' style='margin-right: 10px' />";
    html += "      </h1>";
    html += "      <div id='lfo_amt'></div>";
    html += "      <div id='lfo_freq'></div>";
    html += "      <div id='lfo_fxfreq'></div>";
    html += "    </div>";
    html += "    <div class='noi'>";
    html += "      <h1>NOI</h1>";
    html += "      <div id='fx_drive'></div>";
    html += "      <div id='fx_dist'></div>";
    html += "    </div>";
    html += "  </div>";
    html += "  <div class='status'>";
    html += "    LOG";
    html += "    <span id='statusText'>Idle.</span>";
    html += "    <div id='exportWAV' class='icon export_wav' title='Export song as .wav'></div>";
    html += "    <div id='exportBINARY' class='icon export_binary' title='Export song as binary'></div>";
    html += "    <div id='exportJS' class='icon export_json' title='Export song as .json'></div>";
    html += "    <hr />";
    html += "  </div>";

    return "<yu style='vertical-align:top' class='everything'>"+html+"</yu>";
  }
}

lobby.summon.confirm("Marabu");