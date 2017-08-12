
var GUI = null;
var keyboard = null;

function Marabu()
{
  App.call(this);

  this.name = "marabu";

  this.window.size = {width:420,height:510};
  this.window.pos = {x:30,y:0};
  this.window.theme = "noir";

  this.instrument = null;

  this.setup.includes = [
    "core/jammer",
    "core/keyboard",
    "core/player-small",
    // "core/player-worker",
    "core/player",
    "core/rle",

    "gui/gui",

    "inc/Blob",
    "inc/deflate",
    "inc/FileSaver",
    "inc/inflate",

    "controllers/controller",
    "controllers/instrument_controller",
    "controllers/pattern_controller",
    "controllers/sequence_controller",

    "instrument",
    "sequencer"
  ];

  this.setup.start = function()
  {
    this.app.sequencer = new Sequencer();
    this.app.instrument = new Instrument();

    this.app.wrapper_el.innerHTML = this.app.draw();

    this.app.wrapper_el.innerHTML += this.app.sequencer.build();
    this.app.wrapper_el.innerHTML += this.app.instrument.build();

    setTimeout(function(){ gui_init(); }, 100); 
  }

  this.draw = function()
  {
    var html = "";

    html += "<style>";
    html += ".everything { color:white; }";
    html += ".tracks tr {  line-height:15px}";
    html += ".tracks tr td { text-align:center; padding-right:5px}";
    html += "</style>";

    return "<yu style='vertical-align:top' class='everything'>"+html+"</yu>";
  }

  this.status = function()
  {
    var html = "";
    // html += GUI.sequence_controller.status();
    // console.log(GUI.sequence_controller);
    return html;
  }
}

lobby.summon.confirm("Marabu");
