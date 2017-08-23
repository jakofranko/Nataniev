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

  this.selection = {instrument:0,track:0};
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

  this.setup.ready = function()
  {
    this.app.song = new Song();
    this.app.sequencer = new Sequencer(120);
    this.app.editor = new Editor(8,4);
    this.app.instrument = new Instrument();
  }

  this.setup.start = function()
  {
    this.app.wrapper_el.innerHTML = this.app.draw();

    this.app.wrapper_el.innerHTML += "<div id='sequencer' style='width:105px; display:inline-block; vertical-align:top'><table class='tracks' id='sequencer-table'></table></div>";
    this.app.wrapper_el.innerHTML += "<div id='pattern' style='width:320px; display:inline-block; vertical-align:top; border-left:1px solid #333; padding-left:30px; margin-left:-5px'><table class='tracks' id='pattern-table'></table></div>";
    this.app.wrapper_el.innerHTML += this.app.instrument.build();

    this.app.song.init();

    this.app.sequencer.start();
    this.app.editor.start();
    this.app.instrument.start();  

    this.app.sequencer.update();
    this.app.editor.update();
    this.app.instrument.update();  
  }

  this.update = function()
  {
    this.selection.instrument = clamp(this.selection.instrument,0,7);
    this.selection.track = clamp(this.selection.track,0,32);

    console.log("Update",this.selection);

    this.sequencer.update();
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

  this.location_name = function()
  {
    return this.location ? this.location.split("/")[this.location.split("/").length-1].split(".")[0] : "untitled";
  }

  this.status = function()
  {
    var html = "";
    
    var sequences_count = this.song.song().endPattern-1;
    var bpm = 120;    // Beats per minute
    var spm = bpm/32; // Sequences per minute
    var seconds = (sequences_count/spm) * 60;
    var time = (seconds/4) > 120 ? parseInt(seconds/4/60)+"m" : (seconds/4)+"s";
    var file_name = this.location_name();

    html += "/ <b>"+file_name+"</b> > ";
    html += "Octave "+this.instrument.octave+" ";
    html += "Length "+sequences_count+" ";
    html += "Time "+time+" ";
    html += "Rate "+bpm+"bpm ";
    
    return html;
  }

  this.active = function()
  {
    var pattern = this.song.pattern_at(this.selection.instrument,this.selection.track);
    return {pattern:pattern};
  }

  this.move_inst = function(mod)
  {
    this.selection.instrument += mod;
    this.update();
  }

  this.move_pattern = function(mod)
  {
    var p = this.active().pattern + mod;
    p = clamp(p,0,15);
    this.song.inject_pattern_at(this.selection.instrument,this.selection.track,p);
    this.update();
  }

  this.when.key = function(key)
  {
    if(key == "ArrowLeft"){ this.app.move_inst(-1); return; }
    if(key == "ArrowRight"){ this.app.move_inst(1); return; }
    if(key == "+"){ this.app.move_pattern(1); return; }
    if(key == "-" || key == "_"){ this.app.move_pattern(-1); return; }
  }
}

// Tools

var to_hex = function(num, count)
{
  var s = num.toString(16).toUpperCase();
  for (var i = 0; i < (count - s.length); ++i){
    s = "0" + s;
  }
  return s;
};

var clamp = function(val,min,max)
{
  val = val < min ? min : val;
  val = val > max ? max : val;
  return val;
}

lobby.summon.confirm("Marabu");
