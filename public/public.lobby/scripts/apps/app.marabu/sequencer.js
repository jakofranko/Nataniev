function Sequencer()
{
  this.build = function()
  {
    var html = "";

    html += "  <div class='sequencer' id='sequence_controller' style='width:120px; display:inline-block; vertical-align:top'>";
    html += "    <h1 class='lh30'><b>SEQ</b>";
    html += "      <input id='bpm' type='text' size='3' value='' title='Beats per minute (song speed)' class='bh fh'/>";
    html += "      <span id='sequencerCopy' class='icon copy hide'></span>";
    html += "      <span id='sequencerPaste' class='icon paste hide'></span>";
    html += "      <span id='sequencerPatDown' class='icon remove hide'></span>";
    html += "      <span id='sequencerPatUp' class='icon add hide'></span>";
    html += "      <span id='playSong' class='icon play_song' title='Play song'></span>";
    html += "      <span id='stopPlaying' class='icon play_stop hide' title='Stop playing'></span>";
    html += "    </h1>";
    html += "    <div id='sequencer'>";
    html += "      <table class='tracks' id='sequencer-table'></table>";
    html += "    </div>";
    html += "    <span class='status fl' id='sequence_controller_status' style='display:none'></span>";
    html += "  </div>";
    html += "  <div class='pattern' id='pattern_controller' style='width:135px; display:inline-block; vertical-align:top; border-left:1px solid #333; padding-left:30px; margin-left:-5px'>";
    html += "    <h1 class='lh30'><b>PAT</b>";
    html += "      <input id='rpp' type='text' size='3' value='' title='Rows per pattern' class='bh fh' />";
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
    html += "    <span class='status' id='pattern_controller_status' style='display:none'></span>";
    html += "  </div>";
    html += "  <div class='effects hide' style='display:none'>";
    html += "    <h1>MOD";
    html += "      <span id='fxCopy' class='icon copy'></span>";
    html += "      <span id='fxPaste' class='icon paste'></span>";
    html += "      <hr />";
    html += "    </h1>";
    html += "  </div>";

    return html;
  }
}

lobby.apps.marabu.setup.confirm("sequencer");
