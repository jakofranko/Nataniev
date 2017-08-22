function Marabu()
{
  App.call(this);

  this.name = "marabu";

  this.window.size = {width:600,height:510};
  this.window.pos = {x:30,y:0};
  this.window.theme = "noir";

  this.song = null;
  this.sequencer = null;
  this.editor = null;
  this.instrument = null;

  this.location = null;
  this.formats = ["mar"];

  this.IO.pos = {x:30,y:30}
  this.IO.route("uv_update","ide","print");

  this.setup.includes = [
    "methods/create",
    "methods/play",
    "methods/stop",
    "methods/set",
    "methods/load",
    "methods/save",
    "methods/render",

    "core/jammer",
    "core/player",

    "inc/Blob",
    "inc/FileSaver",

    "song",
    "instrument",
    "editor",
    "sequencer",
    "sequencer.follower"
  ];

  // TODO
  // Add methods for play_range, play_song, stop

  this.setup.start = function()
  {
    this.app.sequencer = new Sequencer(120);
    this.app.editor = new Editor(8,4);
    this.app.instrument = new Instrument();

    this.app.sequencer.follower = new Sequencer_Follower();

    this.app.wrapper_el.innerHTML = this.app.draw();

    this.app.wrapper_el.innerHTML += this.app.sequencer.build();
    this.app.wrapper_el.innerHTML += this.app.editor.build();
    this.app.wrapper_el.innerHTML += this.app.instrument.build();

    this.app.song = new Song();
    this.app.song.init();

    this.app.sequencer.refresh();
    this.app.editor.refresh();

    this.app.instrument.install();
    this.app.instrument.start();
    this.app.instrument.refresh();

    this.app.song.update_rpp(this.app.editor.pattern.length);

    lobby.apps.marabu.sequencer.select();
  }

  this.draw = function()
  {
    var html = "";

    html += "<style>";
    html += ".everything { color:white; }";
    html += ".tracks { text-align:left}";
    html += ".tracks tr {  line-height:15px; position:relative}";
    html += ".tracks tr td { padding: 0 2.5px; color:#555}";
    html += "#sequencer tr td { padding-right:0px;}";
    html += ".tracks tr:hover { color:#999}";
    html += ".tracks tr td { position:relative}";
    html += ".tracks td:hover { cursor:pointer}";
    html += ".tracks tr td:hover { cursor:pointer; color:#fff}";
    html += ".tracks td.selected { color:#fff}";
    html += ".tracks tr.beat th { color:#999}";
    html += ".tracks tr th { color:#555; font-family: 'input_mono_medium'; padding: 0 2.5px;}";
    html += ".tracks tr th:hover { cursor:pointer; color:#999}";
    html += ".tracks.playing tr td {color:#555}";
    html += ".tracks.playing tr th {color:#555}";
    html += ".tracks.playing tr.played td {color:#fff}";
    html += ".tracks.playing tr.played th {color:#fff}";
    html += ".tracks tr.playpos td:first-child:before { content:'>'; color:#999; position:absolute; left:-15px;}";
    html += "</style>";

    return "<yu style='vertical-align:top' class='everything'>"+html+"</yu>";
  }

  this.status = function()
  {
    var html = "";
    
    var sequences_count = this.song.song().endPattern-1;
    var bpm = 120;    // Beats per minute
    var spm = bpm/32; // Sequences per minute
    var seconds = (sequences_count/spm) * 60;
    var time = (seconds/4) > 120 ? parseInt(seconds/4/60)+"m" : (seconds/4)+"s";
    var file_name = this.location ? this.location.split("/")[this.location.split("/").length-1].split(".")[0] : "untitled";

    html += "/ <b>"+file_name+"</b> > ";
    html += "Octave "+this.instrument.octave+" ";
    html += "Length "+sequences_count+" ";
    html += "Time "+time+" ";
    html += "Rate "+bpm+"bpm ";
    
    return html;
  }

  this.when.key = function(key)
  {
    this.app.instrument.when.key(key);
    this.app.editor.when.key(key);
    this.app.sequencer.when.key(key);
  }

  this.when.pattern_change = function()
  {
    
  }
}

lobby.summon.confirm("Marabu");
