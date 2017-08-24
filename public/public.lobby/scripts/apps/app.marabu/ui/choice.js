function UI_Choice(id,name = "UNK",choices = [],control = null)
{
  var app = lobby.apps.marabu;
  var self = this;

  this.id = id;
  this.name = name;
  this.choices = choices;
  this.control = control;  

  this.el = document.getElementById(id);
  this.name_el = document.createElement("t");
  this.value_el = document.createElement("t");

  this.index = 0;

  var target = this;

  this.install = function()
  {
    this.el.style.padding = "0px 2.5px";
    this.el.style.width = "80px";
    // Name Span
    this.name_el.className = "name";
    this.name_el.innerHTML = this.name;
    this.name_el.style.width = "30px";
    this.name_el.style.display = "inline-block";

    this.value_el.textContent = this.min+"/"+this.max;

    this.el.appendChild(this.name_el);
    this.el.appendChild(this.value_el);

    this.el.addEventListener("mousedown", this.mouse_down, false);
  }

  this.mod = function(v)
  {
    var v = clamp(v,-1,1);
    v = v % this.choices.length;
    this.index += v;
    this.update();
  }

  this.override = function(v)
  {
    var v = v % this.choices.length;
    this.index = v;
    this.update();
  }

  this.save = function()
  {
    var control_storage = app.instrument.get_storage(this.id);
    var value = this.index;
    
    app.song.inject_control(app.selection.instrument,control_storage,value);
  }

  this.update = function()
  {
    var target = this.choices[this.index % this.choices.length];
    this.value_el.textContent = target;

    lobby.apps.marabu.instrument.set_control(this.id,this.index);

    var app = lobby.apps.marabu;
    this.el.className = app.selection.control == this.control ? "bl" : "";
    this.name_el.className = app.selection.control == this.control ? "fh" : "fm";
  }

  this.mouse_down = function()
  {
    app.selection.control = self.control;
    app.update();
  }
}

lobby.apps.marabu.setup.confirm("ui/choice");