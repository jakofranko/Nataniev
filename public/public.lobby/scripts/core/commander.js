function Commander()
{
	App.call(this);

	this.el = document.createElement("yu"); this.el.id = "commander";
	this.input_el = document.createElement("input"); this.input_el.id = "commander_input";
	this.app_icon_el = document.createElement("yu"); this.app_icon_el.id = "app_icon"; this.app_icon_el.className = "icon";
	this.widgets_el = document.createElement("yu"); this.widgets_el.className = "widgets";
	this.notification_el = document.createElement("yu"); this.notification_el.className = "notification";
	this.hint_el = document.createElement("yu"); this.hint_el.className = "hint";
	this.browser_el = document.createElement("yu"); this.browser_el.className = "browser";

	this.input_el.setAttribute("autocomplete","off")
	this.input_el.setAttribute("autocorrect","off")
	this.input_el.setAttribute("autocapitalize","off")
	this.input_el.setAttribute("spellcheck","false")
	this.input_el.setAttribute("type","text")

	this.el.appendChild(this.widgets_el);

	this.el.appendChild(this.app_icon_el);
	this.el.appendChild(this.input_el);
	this.el.appendChild(this.hint_el);
	this.el.appendChild(this.notification_el);
	this.el.appendChild(this.browser_el);

	this.input_el.addEventListener('input', input_change, false);

	this.app = null;
	this.tree = [];

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
      html += "No candidates found."
    }
    else{
    	var i = 0;
      for(candidate_id in candidates){
      	if(i > 7){ break; }
        html += "<ln class='lh15 "+(candidate_id == candidates.length-1 ? 'b0 ff' : 'f0')+"'>"+candidates[candidate_id]+'</ln>';
        i += 1;
      }  
    }
    this.browser_el.innerHTML = html;
	}

	this.select_candidate = function(t,formats)
	{
		var candidates = this.find_candidates(t,formats);
		return candidates[candidates.length-1];
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
		this.update();
		this.app_icon_el.className = "icon "+app.name;
		lobby.commander.update_hint();
	}

	this.deselect = function()
	{
		for(app_id in lobby.apps){
			lobby.apps[app_id].deselect();
		}
		this.app = null;
		this.app_icon_el.className = "icon ";
	}

	this.validate = function()
	{
		if(!this.app){ console.warn("No app selected"); return; }
		if(this.input_el !== document.activeElement){ return; }

		var input = this.input_el.value;
		var method_name = input.indexOf(".") < 1 ? "default" : input.split(" ")[0].split(".")[1];

		if(!this.app[method_name]){ console.warn("Unknown method "+method_name); return; }

		var value = input.replace(this.app.name+"."+method_name,"").trim();
		this.app[method_name](value);
		this.input_el.value = "";
		this.update_hint();
	}

	function input_change()
	{
		var value = lobby.commander.input_el.value;
		var target_app = value.indexOf(".") > -1 ? lobby.apps[value.split(".")[0]] : lobby.apps[value];

		if(target_app){ lobby.commander.select(target_app); target_app.on_input_change(value); }
		else{ lobby.commander.deselect(); }

		lobby.commander.update_hint();
	}

	this.update_hint = function()
	{
		var html = "";
		var value = this.input_el.value;
		var app_name = value.split(".")[0].toLowerCase();

		html += value != "" ? "<span class='input'>"+value+"</span> " : "";

		if(lobby.apps[app_name]){
			html += lobby.apps[app_name].hint(value);
		}
		else{
			html += this.hint(value);
		}
		this.hint_el.innerHTML = html;
	}

	this.hint = function()
	{
		html = "";
		for(app_id in lobby.apps){
			html += "<span class='application'>"+lobby.apps[app_id].name+"</span> ";
		}
		return html
	}

	this.update = function()
	{

	}

	this.inject = function(val)
	{
		this.input_el.value = val;
		input_change();
	}

	this.install_widget = function(el)
	{
		console.log("installing widget",el);
		this.widgets_el.appendChild(el);
	}

	this.notify = function(content)
	{
		this.notification_el.innerHTML = content;
    $(this.notification_el).css('opacity','1').delay(1000).animate({ opacity: 0 }, 300);
	}

	this.is_typing = function()
	{
		return this.input_el === document.activeElement ? true : false;
	}
}