function Commander()
{
	this.el = document.createElement("yu"); this.el.id = "commander";
	this.input_el = document.createElement("input"); this.input_el.id = "commander_input";
	this.widgets_el = document.createElement("yu"); this.widgets_el.className = "widgets";
	this.notification_el = document.createElement("yu"); this.notification_el.className = "notification";
	this.hint_el = document.createElement("yu"); this.hint_el.className = "hint";
	this.browser_el = document.createElement("yu"); this.browser_el.className = "browser";
  this.status_el = document.createElement("yu"); this.status_el.className = "status";

	this.input_el.setAttribute("autocomplete","off")
	this.input_el.setAttribute("autocorrect","off")
	this.input_el.setAttribute("autocapitalize","off")
	this.input_el.setAttribute("spellcheck","false")
	this.input_el.setAttribute("type","text")

	this.el.appendChild(this.widgets_el);
	this.el.appendChild(this.input_el);
	this.el.appendChild(this.hint_el);
	this.el.appendChild(this.notification_el);
  this.el.appendChild(this.browser_el);
  this.el.appendChild(this.status_el);

	this.app = null;
	this.tree = [];
  this.autocomplete = null;

  this.bind = function(app)
  {
    this.release();
    console.log("commander.bind",app.name);
    this.app = app;
    this.app.when.bind();
  }

  this.release = function()
  {
    if(!this.app){ return; }
    console.log("commander.release",this.app.name);
    this.app = null;
  }

  this.next_app = function()
  {
    console.log("!!")
  }

  this.key_down = function(e = null)
  {
    lobby.commander.hide_browser();

    if(e && e.key == "Enter"){
      lobby.commander.run();
    }

    if(e && e.key == "Escape"){
      if(lobby.commander.input_el.value == ""){
        lobby.commander.input_el.blur();
      }
      lobby.commander.inject("");
      lobby.commander.update_hint();
    }

    // Check for passive
    var value = lobby.commander.input_el.value;
    if(value.indexOf(".") > -1 && value.indexOf(" ")){
      var app_name = value.split(" ")[0].split(".")[0];
      var method_name = value.split(" ")[0].split(".")[1];
      var app = lobby.apps[app_name];

      var param = value.split(" "); param.shift(); param = param.join(" ").trim();
      var settings = null;

      // Parse Settings
      if(param.indexOf("<") > -1 && param.indexOf(">") > -1){
        settings = param.split("<")[1].replace(">","").trim();
        param = param.split("<")[0];
      }
      
      if(app && app.methods[method_name] && app.methods[method_name].passive){
        app[method_name](param,true,settings);
        lobby.commander.bind(app);
      }
    }

    lobby.commander.update_hint();
  }

  this.run = function(cmd = lobby.commander.input_el.value)
  {
    var value = cmd;
    var app_name = value.split(" ")[0].split(".")[0];
    var method_name = value.split(" ")[0].split(".")[1] ? value.split(" ")[0].split(".")[1] : "default";
    var app = lobby.apps[app_name];

    if(!app){ console.log("Unknown app",app_name); return; }
    if(!app.methods[method_name]){ console.warn("Unknown method "+method_name); return; }

    var param = value.split(" "); param.shift(); param = param.join(" ").trim();
    var settings = null;

    // Parse Settings
    if(param.indexOf("<") > -1 && param.indexOf(">") > -1){
      settings = param.split("<")[1].replace(">","").trim();
      param = param.split("<")[0];
    }

    app[method_name](param,false,settings);
    lobby.commander.bind(app);
    this.input_el.value = "";
    this.update_hint();
    this.update_status();

    lobby.apps.terminal.log(value,">");
  }

	this.install = function()
	{
		this.update_hint();
		this.input_el.focus();
		this.get_tree();
	}

	this.get_tree = function()
	{
    var app = this;
    $.ajax({url: '/ide.tree',
      type: 'POST', 
      data: { file_path: this.location },
      success: function(response) {
        var a = JSON.parse(response);
        app.tree = a;
      }
    })
	}

	// Fuzzy

	this.find_candidates = function(t,formats)
	{
		var targets = t.split(" ");
		var candidates = [];
    for(file_id in this.tree){
      var file_name = this.tree[file_id];
      var parts = file_name.split(".");
      var ext = parts[parts.length-1];
      var found = 0;
      for(target_id in targets){
        var target = targets[target_id];
        if(file_name.indexOf(target) > -1){ found += 1; }
      } 
      if(found == targets.length && formats.indexOf(ext) > -1){
        candidates.push(file_name);   
      }
    }

    return candidates;
	}

	this.browse_candidates = function(t,formats)
	{
		var candidates = this.find_candidates(t,formats);

    var html = "";
    if(candidates.length < 1){
      html += "No candidates found in "+this.tree.length+" files.";
    }
    else{
    	var i = 0;
      for(candidate_id in candidates){
      	if(i > 7){ break; }
        var file_path = candidates[candidate_id];
        var path_part = file_path.split("/");
        var file_name = path_part[path_part.length-1].replace("/","");
        var file_loca = file_path.replace(file_name,"");
        html += "<ln class='lh15 "+(candidate_id == 0 ? 'b0 ff' : 'f0')+"'><t>"+file_loca+"</t><b>"+file_name+"</b></ln>";
        i += 1;
      }  
    }
    this.browser_el.innerHTML = html;
	}

	this.select_candidate = function(t,formats)
	{
		var candidates = this.find_candidates(t,formats);
		return candidates[0];
	}

	this.hide_browser = function()
	{
		this.browser_el.style.display = "none";
	}

	this.show_browser = function()
	{
		this.browser_el.style.display = "block";
	}

	this.select = function(app)
	{
		this.app = app;
		lobby.commander.update_hint();
	}

	this.deselect = function()
	{
		for(app_id in lobby.apps){
			lobby.apps[app_id].deselect();
		}
		this.app = null;
	}

  this.update_status = function(text = null)
  {
    if(!this.app){ return; }

    this.status_el.innerHTML = "<b>"+this.app.name+"</b> "+(text ? text : this.app.status());
  }

	this.update_hint = function(injection = null)
	{
		var html = "";
		var value = this.input_el.value;
		var app_name = value.split(".")[0].toLowerCase();

		html += value != "" ? "<span class='input'>"+value+"</span>" : "";

    if(injection){
      html += injection;
    }
		else if(lobby.apps[app_name]){
			html += lobby.apps[app_name].hint(value);
		}
		else{
			html += this.hint(value);
		}
		this.hint_el.innerHTML = html;
	}

	this.hint = function(val)
	{
		html = "";

    if(val.trim() == ""){
      for(app_id in lobby.apps){
        html += "<span class='application'>"+lobby.apps[app_id].name+"</span> ";
      }  
    }
    else{ 
      for(app_id in lobby.apps){
        var app_name = lobby.apps[app_id].name;
        if(app_name.indexOf(val) > -1){
          html += "<t class='autocomplete'>"+app_name.replace(val,'')+"</t>";
          this.autocomplete = app_name+".";
          break;
        }
      }
    }

		return html
	}

	this.inject = function(val)
	{
    this.autocomplete = null;
		this.input_el.value = val;
    this.key_down();
	}

	this.install_widget = function(el)
	{
		this.widgets_el.appendChild(el);
	}

	this.notify = function(content)
	{
		this.notification_el.innerHTML = content;
    $(this.notification_el).css('opacity','1').delay(2000).animate({ opacity: 0 }, 300);
    lobby.apps.terminal.log(content,"!");
	}

	this.is_typing = function()
	{
    // if(document.activeElement.type == "input"){ return true; }
		return this.input_el === document.activeElement ? true : false;
	}

  this.on_key = function(k)
  {
    if(k == "Escape"){ this.hide_browser(); this.inject(""); }
  }

  this.touch_cmd = function(e)
  {
    lobby.commander.run(e.target.command);
  }

  this.create_cmd = function(html,cmd = null,class_name = "")
  {
    var cmd_el = document.createElement("cmd");
    cmd_el.innerHTML = html;
    cmd_el.command = cmd;
    cmd_el.className = class_name;
    cmd_el.addEventListener('mousedown', this.touch_cmd, false);
    return cmd_el;
  }

  this.input_el.onkeydown = this.key_down;
}