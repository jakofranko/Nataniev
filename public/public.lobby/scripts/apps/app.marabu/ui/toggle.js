function UI_Toggle(id,name = "UNK")
{
  this.id = id;
  this.name = name;
  this.el = document.getElementById(id);
  this.value = 0;
  this.el.style.cursor = "pointer";

  var target = this;

  this.install = function()
  {
    this.el.innerHTML = this.name;
    this.update();
  }

  this.update = function()
  {
    this.el.style.color = this.value == 1 ? "#fff" : "#555";
    lobby.apps.marabu.instrument.set_control(this.id,this.value);
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