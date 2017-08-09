function Ide()
{
	App.call(this);

  this.name = "ide";

  this.window.size = {width:780,height:420};
  this.window.pos = {x:120,y:120};
  this.window.theme = "noir";

  this.methods.create = {name:"create"};
  this.methods.replace = {name:"replace", shortcut:"r"};
  this.methods.end = {name:"end"};

  this.setup.includes = ["navi","methods/load","methods/save","methods/create","methods/find","methods/goto","methods/spellcheck"];

  this.formats = ["js","rb","html","css","ma","mh","rin","mar"];

  this.navi_el = document.createElement("yu"); this.navi_el.className = "at al lh15 w6 ml mt hf_2";
  this.markers_el = document.createElement("yu"); this.markers_el.className = "w6"; this.navi_el.appendChild(this.markers_el);
  this.history_el = document.createElement("yu"); this.history_el.className = "ab w6 lh15"; this.navi_el.appendChild(this.history_el);

  this.textarea_el = document.createElement("textarea"); this.textarea_el.className = "wf_9 al7 pa hf_2 pdl";
  this.textarea_el.style.display = "none";
  this.wrapper_el.appendChild(this.textarea_el);
  this.wrapper_el.appendChild(this.navi_el);

  this.textarea_el.setAttribute("autocomplete","off")
  this.textarea_el.setAttribute("autocorrect","off")
  this.textarea_el.setAttribute("autocapitalize","off")
  this.textarea_el.setAttribute("spellcheck","false")
  this.textarea_el.setAttribute("type","text")
  this.textarea_el.setAttribute("wrap","off")
  this.textarea_el.style.resize = "none";
  this.textarea_el.style.wrap = "soft";

  this.setup.start = function()
  {
    this.app.create();
  }

  this.when.resize = function()
  {
    this.app.navi.update();
  }
  
  function key_down(e)
  {
    lobby.commander.update_status();
  }

  function mouse_down()
  {
    lobby.commander.update_status();
  }
  function mouse_up()
  {
    lobby.commander.update_status();
  }

  function text_change()
  {
    lobby.commander.update_status();
    lobby.apps.ide.navi.update();
  }

  this.location = "";
  this.history = [];

  this.view_editor = function()
  {
    this.textarea_el.style.display = "block";
    this.navi_el.style.display = "block";

    this.window.organize.fill();
    this.navi.update();
    lobby.commander.update_status();
    this.textarea_el.value = "";
    this.textarea_el.focus();
  }

  this.replace = function(val)
  {
    console.log(val)
  }

  this.status = function()
  {
    var lines_active = this.textarea_el.value.substr(0,this.textarea_el.selectionEnd).split("\n").length;
    var lines_count = this.textarea_el.value.split("\n").length;
    var lines_display = lines_active+"/"+lines_count+"L ";

    var chars_active = this.textarea_el.selectionStart != this.textarea_el.selectionEnd ? this.textarea_el.selectionStart+":"+this.textarea_el.selectionEnd : this.textarea_el.selectionStart;
    var chars_count = this.textarea_el.textLength;
    var chars_display = chars_active+"/"+chars_count+"C ";
    
    var scroll_position = parseInt(lines_active/parseFloat(lines_count) * 100);

    return this.location+" "+lines_display+chars_display+" <b class='di'>"+scroll_position+"%</b> <t class='right'>"+this.window.size.width+"x"+this.window.size.height+"</t>";
  }

  this.when.key = function(key)
  {
    if(key == "escape"){
      this.app.textarea_el.blur();
    }
    if(key == "tab"){
      this.app.inject("  ");
    }
  }

  this.inject = function(characters = "__")
  {
    var pos = this.textarea_el.selectionStart;
    var before = this.textarea_el.value.substr(0,pos);
    var middle = characters;
    var after  = this.textarea_el.value.substr(pos,this.textarea_el.value.length);

    this.textarea_el.value = before+middle+after;
    this.textarea_el.setSelectionRange(pos+characters.length,pos+characters.length);
  }

  this.textarea_el.addEventListener('input', text_change, false);
  this.textarea_el.addEventListener('keydown', key_down, false);
  this.textarea_el.addEventListener('mousedown', mouse_down, false);
  this.textarea_el.addEventListener('mouseup', mouse_up, false);
}

lobby.summon.confirm("Ide");
