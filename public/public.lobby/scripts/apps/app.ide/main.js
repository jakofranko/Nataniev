function Ide()
{
	App.call(this);

  this.name = "ide";
  this.size = {width:780,height:420};
  this.origin = {x:120,y:120};
  this.theme = "noir";
  this.methods.new = {name:"new"};
  this.methods.load = {name:"load"};
  this.methods.save = {name:"save"};
  this.methods.replace = {name:"replace"};
  this.methods.end = {name:"end"};

  this.formats = ["js","rb","html","css","ma","mh"];

  this.navi_el = document.createElement("yu"); this.navi_el.className = "at al lh15 w4";
  this.status_el = document.createElement("yu"); this.status_el.className = "pa ab al lh30 w4 mb15 ml wf f9";

  this.textarea_el = document.createElement("textarea"); this.textarea_el.className = "wf_7 pl5 pa hf_3 sl pdl";
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
  this.textarea_el.addEventListener('mousemove', mouse_move, false);

  function key_down()
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
  function mouse_move()
  {
    lobby.apps.ide.update_status();
  }

  function text_change()
  {
    lobby.apps.ide.update_navi();
  }

  this.location = "";

  this.load = function(val, is_passive = false)
  {
    if(is_passive){
      lobby.commander.show_browser();
      lobby.commander.browse_candidates(val,this.formats);
    }
    else{
      lobby.commander.hide_browser();
      this.load_file(lobby.commander.select_candidate(val,this.formats));
    }
    return val;
  }

  this.on_input_change = function(value)
  {
    if(value.split(" ")[0] == "ide.save"){
      if(this.location){
        this.status_el.innerHTML = "Overwrite <b class='ff'>"+this.location+"</b>?";
      }
      else{
        this.status_el.innerHTML = "No file selected.";  
      }
    }
    else if(value.split(" ")[0] == "ide.load"){
      var val = value.split(" "); val.shift(); val = val.join(" ").trim();
      this.load(val,true);
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
        app.organize_window_vertical();
        app.update_navi();
      }
    })
  }

  this.save = function()
  {
    if(!this.location){ return; }

    $.ajax({url: '/ide.save',
      type: 'POST', 
      data: { file_path: this.location, file_content: this.textarea_el.value },
      success: function(data) {
        console.log(data);
        lobby.commander.notify("Saved.");
      }
    })

    this.textarea_el.style.display = "block";
    this.navi_el.style.display = "block";
    this.organize_window_vertical();
  }

  this.replace = function(val)
  {
    console.log(val)
  }

  this.update_navi = function()
  {
    var lines = this.textarea_el.value.split("\n");

    var html = "";

    for(line_id in lines)
    {
      var line = lines[line_id];
      var marker = line.trim().split(" ")[0];
      var targets_minor = ["def","attr_accessor","function"];
      var targets_major = ["class","module"];
      var targets_miscs = ["private"];
      if(targets_major.indexOf(marker) > -1){
        var name = line.replace(marker,"").trim().split(" ")[0].substr(0,14);
        html += "<ln>"+name+"</ln>";
      }
      if(targets_minor.indexOf(marker) > -1){
        var name = line.replace(marker,"").trim().split(" ")[0].substr(0,14);
        html += "<ln class='f9'>"+name+"</ln>";
      }
      if(targets_miscs.indexOf(marker) > -1){
        var name = line.trim().split(" ")[0].substr(0,14);
        html += "<ln class='f5'>"+name+"</ln>";
      }
    }
    this.navi_el.innerHTML = html;

    this.update_status();
  }

  this.update_status = function()
  {
    var lines_count = this.textarea_el.value.split("\n").length;
    var selection = this.textarea_el.selectionStart != this.textarea_el.selectionEnd ? this.textarea_el.selectionStart+":"+this.textarea_el.selectionEnd : this.textarea_el.selectionStart;
    var size = "<t class='f5'>"+this.size.width+"x"+this.size.height+"</t>"

    this.status_el.innerHTML = this.location+" "+selection+"/"+this.textarea_el.textLength+" "+size;
  }

  this.key_escape = function()
  { 
    lobby.commander.notify("hello!");
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

lobby.install_callback("Ide");
