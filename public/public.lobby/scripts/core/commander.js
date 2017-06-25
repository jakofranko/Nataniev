function Commander()
{
	App.call(this);

	this.el = document.createElement("yu"); this.el.id = "commander";
	this.input_el = document.createElement("input"); this.input_el.id = "commander_input";
	this.app_icon_el = document.createElement("yu"); this.app_icon_el.id = "app_icon"; this.app_icon_el.className = "icon";
	this.hint_el = document.createElement("yu"); this.hint_el.className = "hint";
	this.clock_el = document.createElement("yu"); this.clock_el.className = "clock";
	this.size_el = document.createElement("yu"); this.size_el.className = "size";

	this.input_el.setAttribute("autocomplete","off")
	this.input_el.setAttribute("autocorrect","off")
	this.input_el.setAttribute("autocapitalize","off")
	this.input_el.setAttribute("spellcheck","false")
	this.input_el.setAttribute("type","text")

	this.el.appendChild(this.app_icon_el);
	this.el.appendChild(this.input_el);
	this.el.appendChild(this.hint_el);
	this.el.appendChild(this.clock_el);
	this.el.appendChild(this.size_el);

	this.input_el.addEventListener('input', input_change, false);

	this.app = null;

	this.install = function()
	{
		this.update_hint();
		this.update_clock();
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
		if(this.app){ this.app.deselect(); }
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

		if(target_app){ lobby.commander.select(target_app); }
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

	this.clock = function()
	{
		var d = new Date(), e = new Date(d);
		var msSinceMidnight = e - d.setHours(0,0,0,0);
		var val = (msSinceMidnight/864) * 10;
		var val_s = new String(val);
		return val_s.substr(0,3)+":"+val_s.substr(3,3);
	}

	this.update_clock = function()
	{
		this.clock_el.innerHTML = this.clock();

		setTimeout(function(){ lobby.commander.update_clock(); }, 500);
	}

	this.is_typing = function()
	{
		return this.input_el === document.activeElement ? true : false;
	}
}