function UI_Toggle(id,name = "UNK",control = null)
{
  this.id = id;
  this.name = name;
  this.el = document.getElementById(id);
  this.value = 0;
  this.control = control;
  this.el.style.cursor = "pointer";

  var target = this;

  this.install = function()
  {
    this.el.style.padding = "0px 2.5px";
    
    this.el.innerHTML = this.name;
    this.update();
  }

  this.update = function()
  {
    var app = lobby.apps.marabu;

    this.el.style.color = this.value == 1 ? "#fff" : "#555";
    app.instrument.set_control(this.id,this.value);

    this.el.className = app.selection.control == this.control ? "bl" : "";
  }

  this.override = function(value)
  {
    this.value = value;
    this.update();
  }

  this.mouse_down = function()
  {
    target.value = target.value == 1 ? 0 : 1;
    target.update();
  }

  this.el.addEventListener("mousedown", this.mouse_down, false);
}

lobby.apps.marabu.setup.confirm("ui/toggle");