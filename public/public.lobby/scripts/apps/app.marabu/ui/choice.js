function UI_Choice(id,name = "UNK",choices = [],control = null)
{
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
  }

  this.override = function(id)
  {
    this.index = id;
    this.update();
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
    target.index += 1;
    target.index = target.index % target.choices.length;

    if(!target.choices[target.index]){ target.index += 1; }
    target.update();
  }

  this.el.addEventListener("mousedown", this.mouse_down, false);
}

lobby.apps.marabu.setup.confirm("ui/choice");