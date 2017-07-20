function Commander()
{
	App.call(this);

	this.el = document.createElement("yu"); this.el.id = "commander";
	this.input_el = document.createElement("input"); this.input_el.id = "commander_input";
	this.app_icon_el = document.createElement("yu"); this.app_icon_el.id = "app_icon"; this.app_icon_el.className = "icon";
	this.widgets_el = document.createElement("yu"); this.widgets_el.className = "widgets";
	this.hint_el = document.createElement("yu"); this.hint_el.className = "hint";

	this.input_el.setAttribute("autocomplete","off")
	this.input_el.setAttribute("autocorrect","off")
	this.input_el.setAttribute("autocapitalize","off")
	this.input_el.setAttribute("spellcheck","false")
	this.input_el.setAttribute("type","text")

	this.el.appendChild(this.widgets_el);

	this.el.appendChild(this.app_icon_el);
	this.el.appendChild(this.input_el);
	this.el.appendChild(this.hint_el);

	this.input_el.addEventListener('input', input_change, false);

	this.app = null;

	this.install = function()
	{
		this.update_hint();
		this.input_el.focus();
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

	this.is_typing = function()
	{
		return this.input_el === document.activeElement ? true : false;
	}
}