function Ide()
{
	App.call(this);

  this.name = "ide";

  this.window.size = {width:780,height:420};
  this.window.pos = {x:120,y:120};

  this.methods.create = {name:"create"};
  this.methods.replace = {name:"replace", shortcut:"r"};
  this.methods.end = {name:"end"};

  this.methods.go_up = {name:"go_up", shortcut:"z", run_shortcut:true};
  this.methods.go_down = {name:"go_down", shortcut:"x", run_shortcut:true};

  this.setup.includes = ["methods/load","methods/save","methods/create","methods/find"];

  this.formats = ["js","rb","html","css","ma","mh","rin","mar"];

  this.navi_el = document.createElement("yu"); this.navi_el.className = "at al lh15 w4 ml mt";
  this.textarea_el = document.createElement("textarea"); this.textarea_el.className = "wf_7 pl5 pa hf_2 pdl";
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
    lobby.apps.ide.update_navi();
  }

  this.location = "";

  this.view_editor = function()
  {
    this.textarea_el.style.display = "block";
    this.navi_el.style.display = "block";

    this.window.organize.fill();
    this.update_navi();
    lobby.commander.update_status();
    this.textarea_el.value = "";
    this.textarea_el.focus();
  }

  this.load_file = function(file_path)
  {
    this.location = file_path;

    var app = this;
    $.ajax({url: '/ide.load',
      type: 'POST', 
      data: { file_path: this.location },
      success: function(data) {
        app.textarea_el.value = data;
        app.textarea_el.style.display = "block";
        app.navi_el.style.display = "block";
        app.update_navi();
        app.textarea_el.scrollTop = 0;
        lobby.commander.update_status();
      }
    })
  }

  this.replace = function(val)
  {
    console.log(val)
  }

  this.update_navi = function()
  {
    var lines = this.textarea_el.value.split("\n");

    var html = "";

    var count = 0
    for(line_id in lines)
    {
      if(count > 30){ break; }
      var line = lines[line_id];
      var marker = line.trim().split(" ")[0];
      var targets_major = ["class","module"];
      var targets_minor = ["def","attr_accessor","function"];
      var targets_miscs = ["private"];
      if(targets_major.indexOf(marker) > -1){
        var name = line.replace(marker,"").trim().split(" ")[0].substr(0,14);
        html += "<ln class='rel block'>"+name+" <t class='ar'>"+line_id+"</t></ln>";
        count += 1;
      }
      if(targets_minor.indexOf(marker) > -1){
        var name = line.replace(marker,"").trim().split(" ")[0].substr(0,14);
        html += "<ln class='f9 rel block'>"+name+" <t class='ar'>"+line_id+"</t></ln>";
        count += 1;
      }
      if(targets_miscs.indexOf(marker) > -1){
        var name = line.trim().split(" ")[0].substr(0,14);
        html += "<ln class='f5 rel block'>"+name+" <t class='ar'>"+line_id+"</t></ln>";
        count += 1;
      }
    }
    this.navi_el.innerHTML = count == 0 ? "No Markers" : html;
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
    this.textarea_el.focus();
  }

  this.go_up = function()
  {
    var lines = this.textarea_el.value.split("\n");
    var line_id = this.textarea_el.value.substr(0,this.textarea_el.selectionEnd).split("\n").length;
    var target_block = lines.splice(0,line_id - 5).join("\n");

    this.textarea_el.setSelectionRange(target_block.length+1,target_block.length+1);
    this.textarea_el.focus();
    $(this.textarea_el).animate({scrollTop: (line_id - 8) * 15}, 100, function() {});
  }

  this.go_down = function()
  {
    var lines = this.textarea_el.value.split("\n");
    var line_id = this.textarea_el.value.substr(0,this.textarea_el.selectionEnd).split("\n").length;
    var target_block = lines.splice(0,line_id + 5).join("\n");

    this.textarea_el.setSelectionRange(target_block.length+1,target_block.length+1);
    this.textarea_el.focus();
    $(this.textarea_el).animate({scrollTop: (line_id + 3) * 15}, 100, function() {});
  }

  this.textarea_el.addEventListener('input', text_change, false);
  this.textarea_el.addEventListener('keydown', key_down, false);
  this.textarea_el.addEventListener('mousedown', mouse_down, false);
  this.textarea_el.addEventListener('mouseup', mouse_up, false);
}

lobby.summon.confirm("Ide");
