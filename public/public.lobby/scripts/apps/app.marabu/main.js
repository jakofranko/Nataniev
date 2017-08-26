function Marabu()
{
  App.call(this);

  this.name = "marabu";

  this.window.size = {width:870,height:480};
  this.window.pos = {x:30,y:30};
  this.window.theme = "noir";

  this.song = null;
  this.sequencer = null;
  this.editor = null;
  this.instrument = null;

  this.selection = {instrument:0,track:0,row:0,octave:5,control:0,bpm:120};
  this.location = null;
  this.formats = ["mar"];
  this.channels = 16;

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
    "methods/operate",

    "ui/slider",
    "ui/toggle",
    "ui/choice",

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

    this.app.wrapper_el.innerHTML += "<div id='sequencer' style='display:block; vertical-align:top; float:left'><table class='tracks' id='sequencer-table'></table></div>";
    this.app.wrapper_el.innerHTML += "<div id='pattern' style='display:block; vertical-align:top; border-left:1px solid #333; padding-left:15px; margin-left:15px; float:left'><table class='tracks' id='pattern-table'></table></div>";
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
    this.selection.instrument = clamp(this.selection.instrument,0,this.channels-1);
    this.selection.track = clamp(this.selection.track,0,32);
    this.selection.row = clamp(this.selection.row,0,32);
    this.selection.octave = clamp(this.selection.octave,0,8);
    this.selection.control = clamp(this.selection.control,0,28);

    console.log("Update",this.selection);

    this.sequencer.update();
    this.editor.update();
    this.instrument.update();
    lobby.commander.update_status();
  }

  this.draw = function()
  {
    var html = "";

    html += "<style>";
    html += ".tracks tr td { padding: 0 2.5px; color:#555}";
    html += "#sequencer tr td { padding:0px;}";
    html += "#sequencer tr td:first-child { padding-left:2.5px;}";
    html += "#sequencer tr td:last-child { padding-right:2.5px;}";
    html += ".tracks tr:hover { color:#999}";
    html += ".tracks tr td { position:relative}";
    html += ".tracks td:hover { cursor:pointer}";
    html += ".tracks tr td:hover { cursor:pointer; color:#fff}";
    html += ".tracks td.selected { color:#fff}";
    html += ".tracks tr th { color:#555; font-family: 'input_mono_medium'; padding: 0 2.5px;}";
    html += ".tracks tr th:hover { cursor:pointer; color:#999}";
    html += "</style>";

    return "<yu style='vertical-align:top' class='everything'>"+html+"</yu>";
  }

  this.location_name = function()
  {
    return this.location ? this.location.split("/")[this.location.split("/").length-1].split(".")[0] : "SONG";
  }

  this.status = function()
  {
    var html = "";
    
    var sequences_count = this.song.song().endPattern-1;
    var spm = this.selection.bpm/32; // Sequences per minute
    var seconds = (sequences_count/spm) * 60;
    var time = (seconds/4) >  this.selection.bpm ? parseInt(seconds/4/60)+"min" : (seconds/4)+"sec";
    var file_name = this.location_name();
    var instrument_name = this.song.instrument(this.selection.instrument).name ? this.song.instrument(this.selection.instrument).name : "IN"+this.selection.instrument;

    html += "/ <b>"+file_name.toLowerCase()+"</b>."+instrument_name.toLowerCase()+" > ";

    html += this.selection.octave+"oct ";
    html += sequences_count+"tracks ";
    html += time+" ";
    html += this.selection.bpm+"bpm ";

    html += "<span class='right'>I"+this.selection.instrument+"T"+this.selection.track+"R"+this.selection.row+"O"+this.selection.octave+"C"+this.selection.control+" "+this.window.size.width+"x"+this.window.size.height+"</span>";
    
    return html;
  }

  // Controls

  this.move_inst = function(mod)
  {
    this.selection.instrument += mod;
    this.update();
  }

  this.move_pattern = function(mod)
  {
    var p = this.song.pattern_at(this.selection.instrument,this.selection.track) + mod;
    p = clamp(p,0,15);
    this.song.inject_pattern_at(this.selection.instrument,this.selection.track,p);
    this.update();
  }

  this.move_row = function(mod)
  {
    this.selection.row += mod;
    this.update();
  }

  this.move_track = function(mod)
  {
    this.selection.track += mod;
    this.update();
  }

  this.move_octave = function(mod)
  {
    this.selection.octave += mod;
    this.update();
  }

  this.move_control = function(mod)
  {
    this.selection.control += mod;
    this.update();
  }

  this.move_control_value = function(mod)
  {
    var control = this.instrument.control_target(this.selection.control);
    control.mod(mod);
    control.save();
  }

  this.save_control_value = function()
  {
    var control = this.instrument.control_target(this.selection.control);
    var control_storage = this.instrument.get_storage(control.id);
    var control_value = control.value;

    this.song.inject_effect_at(this.selection.instrument,this.selection.track,this.selection.row,control_storage+1,control_value);
    this.update();
  }

  this.set_note = function(val)
  {
    this.song.inject_note_at(this.selection.instrument,this.selection.track,this.selection.row,val-87);
    this.update();
  }

  this.play_note = function(note,right_hand)
  {
    var note_value = note + (this.selection.octave * 12);
    this.song.play_note(note_value);
    this.song.inject_note_at(this.selection.instrument,this.selection.track,this.selection.row+(right_hand ? 0 : 32),note_value);
    this.update();
  }

  this.when.key = function(key)
  {
    // Skip if in input
    if(document.activeElement.type == "text"){ return; }
    // Movement
    if(key == "ArrowRight"){ this.app.move_inst(1); return; }
    if(key == "ArrowLeft"){ this.app.move_inst(-1); return; }
    
    if(key == "+")        { this.app.move_pattern(1); return; }
    if(key == "-")        { this.app.move_pattern(-1); return; }
    if(key == "_")        { this.app.move_pattern(-1); return; }
    if(key == "ArrowDown"){ this.app.move_row(1); return; }
    if(key == "ArrowUp")  { this.app.move_row(-1); return; }
    if(key == "x")        { this.app.move_octave(1); return; }
    if(key == "z")        { this.app.move_octave(-1); return; }
    if(key == "k")        { this.app.move_track(1); return; }
    if(key == "o")        { this.app.move_track(-1); return; }
    if(key == "l")        { this.app.move_control(1); return; }
    if(key == "p")        { this.app.move_control(-1); return; }
    if(key == "2")        { this.app.move_control(1); return; }
    if(key == "1")        { this.app.move_control(-1); return; }
    if(key == "]")        { this.app.move_control_value(10); return; }
    if(key == "[")        { this.app.move_control_value(-10); return; }
    if(key == "}")        { this.app.move_control_value(1); return; }
    if(key == "{")        { this.app.move_control_value(-1); return; }

    if(key == "/")        { this.app.save_control_value(); return; }
    if(key == "Backspace"){ this.app.set_note(0); return; }

    // Keyboard
    var note = null;
    var is_cap = key == key.toLowerCase();
    switch (key.toLowerCase())
    {
      case "a": this.app.play_note(0,is_cap); break;
      case "s": this.app.play_note(2,is_cap); break;
      case "d": this.app.play_note(4,is_cap); break;
      case "f": this.app.play_note(5,is_cap); break;
      case "g": this.app.play_note(7,is_cap); break;
      case "h": this.app.play_note(9,is_cap); break;
      case "j": this.app.play_note(11,is_cap); break;

      case "w": this.app.play_note(1,is_cap); break;
      case "e": this.app.play_note(3,is_cap); break;
      case "t": this.app.play_note(6,is_cap); break;
      case "y": this.app.play_note(8,is_cap); break;
      case "u": this.app.play_note(10,is_cap); break;
    }
  }

  this.wheel = function(e)
  {
    lobby.apps.marabu.move_control_value(e.wheelDeltaY * 0.25)
    e.preventDefault();
  }

  this.el.addEventListener('wheel', this.wheel, false);
}

// Tools

var parse_note = function(val)
{
  val -= 87;
  var notes = ['C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#', 'A-', 'A#', 'B-'];
  var octave = Math.floor((val)/12);
  var key = notes[(val) % 12];
  var key_sharp = key.substr(1,1) == "#" ? true : false;
  var key_note = key.substr(0,1);
  return {octave:octave,sharp:key_sharp,note:key_note};
}

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
