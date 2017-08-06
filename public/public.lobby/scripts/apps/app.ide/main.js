function Ide()
{
	App.call(this);

  this.name = "ide";

  this.window.size = {width:780,height:420};
  this.window.pos = {x:120,y:120};

  this.methods.new = {name:"new"};
  this.methods.replace = {name:"replace", shortcut:"r"};
  this.methods.end = {name:"end"};
  this.methods.find = {name:"find", shortcut:"f"};

  this.setup.includes = ["load","save"];

  this.formats = ["js","rb","html","css","ma","mh","rin","mar"];

  this.navi_el = document.createElement("yu"); this.navi_el.className = "at al lh15 w4 ml mt";
  this.status_el = document.createElement("yu"); this.status_el.className = "pa ab al lh30 w4 mb ml wf f9";

  this.textarea_el = document.createElement("textarea"); this.textarea_el.className = "wf_7 pl5 pa hf_3 pdl";
  this.textarea_el.style.display = "none";
  this.wrapper_el.appendChild(this.textarea_el);
  this.wrapper_el.appendChild(this.navi_el);
  this.wrapper_el.appendChild(this.status_el);

  this.textarea_el.setAttribute("autocomplete","off")
  this.textarea_el.setAttribute("autocorrect","off")
  this.textarea_el.setAttribute("autocapitalize","off")
  this.textarea_el.setAttribute("spellcheck","false")
  this.textarea_el.setAttribute("type","text")
  this.textarea_el.setAttribute("wrap","off")
  this.textarea_el.style.resize = "none";
  this.textarea_el.style.wrap = "soft";

  this.textarea_el.addEventListener('input', text_change, false);
  this.textarea_el.addEventListener('keydown', key_down, false);
  this.textarea_el.addEventListener('mousedown', mouse_down, false);
  this.textarea_el.addEventListener('mouseup', mouse_up, false);

  this.setup.start = function()
  {
    console.log("!")
  }
  
  function key_down(e)
  {
    lobby.apps.ide.update_status();
  }

  function mouse_down()
  {
    lobby.apps.ide.update_status();
  }
  function mouse_up()
  {
    lobby.apps.ide.update_status();
  }

  function text_change()
  {
    lobby.apps.ide.update_navi();
  }

  this.location = "";

  this.find = function(val, is_passive = false)
  {
    var lines = this.textarea_el.value.split("\n");

    for(line_id in lines)
    {
      var line = lines[line_id];
      if(line.indexOf(val) > -1){

        if(!is_passive){
          var from = this.textarea_el.value.indexOf(val);
          var to   = from + val.length;
          this.textarea_el.setSelectionRange(from,to);
          this.textarea_el.focus();
        }
        
        $(this.textarea_el).animate({scrollTop: line_id * 15}, 250, function() {});
        break;
      }
    }
  }

  this.view_editor = function()
  {
    this.textarea_el.style.display = "block";
    this.navi_el.style.display = "block";
    this.status_el.style.display = "block";  

    this.organize_window_vertical();
    this.update_navi();
    this.update_status();
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
        app.update_status();
        app.textarea_el.scrollTop = 0;
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

  this.update_status = function()
  {
    var lines_active = this.textarea_el.value.substr(0,this.textarea_el.selectionEnd).split("\n").length;
    var lines_count = this.textarea_el.value.split("\n").length;
    var lines_display = lines_active+"/"+lines_count+"L ";

    var chars_active = this.textarea_el.selectionStart != this.textarea_el.selectionEnd ? this.textarea_el.selectionStart+":"+this.textarea_el.selectionEnd : this.textarea_el.selectionStart;
    var chars_count = this.textarea_el.textLength;
    var chars_display = chars_active+"/"+chars_count+"C ";

    var size = "<t class='f5'>"+this.window.size.width+"x"+this.window.size.height+"</t>"

    var scroll_position = parseInt(lines_active/parseFloat(lines_count) * 100);

    this.status_el.innerHTML = this.location+" "+lines_display+chars_display+" <b class='di'>"+scroll_position+"%</b> - "+size;
  }
  
  this.key_alt_up = function()
  {
    var gap = 5 * 30;
    $(this.textarea_el).animate({scrollTop: this.textarea_el.scrollTop - gap}, 250, function() {});
  }
  
  this.key_alt_down = function()
  {
    var gap = 5 * 30;
    $(this.textarea_el).animate({scrollTop: this.textarea_el.scrollTop + gap}, 250, function() {});
  }
}

lobby.summon.confirm("Ide");
