
var GUI = null;

function Marabu()
{
  App.call(this);

  this.name = "marabu";

  this.window.size = {width:420,height:510};
  this.window.pos = {x:30,y:0};
  this.window.theme = "noir";

  this.sequencer = null;
  this.editor = null;
  this.instrument = null;

  this.setup.includes = [
    "methods/create",
    "methods/export",
    "methods/import",
    "methods/save",
    "methods/play",
    "methods/stop",
    "methods/set",

    "core/jammer",
    "core/player-small",
    // "core/player-worker",
    "core/player",
    "core/rle",

    "inc/Blob",
    "inc/deflate",
    "inc/FileSaver",
    "inc/inflate",

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
    this.app.sequencer = new Sequencer();
    this.app.editor = new Editor();
    this.app.instrument = new Instrument();

    this.app.sequencer.follower = new Sequencer_Follower();

    this.app.wrapper_el.innerHTML = this.app.draw();

    this.app.wrapper_el.innerHTML += this.app.sequencer.build();
    this.app.wrapper_el.innerHTML += this.app.editor.build();
    this.app.wrapper_el.innerHTML += this.app.instrument.build();

    GUI = new CGUI();
    GUI.init();

    lobby.apps.marabu.sequencer.select();
  }

  this.draw = function()
  {
    var html = "";

    html += "<style>";
    html += ".everything { color:white; }";
    html += ".tracks tr {  line-height:15px; position:relative}";
    html += ".tracks tr td { padding-right:5px}";
    html += ".tracks tr:hover { color:#999}";
    html += ".tracks tr td { position:relative}";
    html += ".tracks td:hover { cursor:pointer}";
    html += ".tracks td.selected { color:#fff}";
    html += ".tracks tr.beat th { color:#999}";
    html += ".tracks.inactive tr td { color:#555}";
    html += ".tracks.inactive tr th { color:#555}";
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
    
    html += this.sequencer.status();
    html += this.editor.status();
    html += this.instrument.status();
    return html;
  }

  this.when.key = function(key)
  {
    this.app.instrument.when.key(key);
    this.app.editor.when.key(key);
    this.app.sequencer.when.key(key);
  }
}

lobby.summon.confirm("Marabu");
