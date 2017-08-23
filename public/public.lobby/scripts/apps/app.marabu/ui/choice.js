function UI_Choice(id,name = "UNK",choices = [])
{
  this.id = id;
  this.name = name;
  this.choices = choices;
  this.el = document.getElementById(id);
  this.el.style.width = "60px";
  this.el.style.display = "inline-block";
  this.el.style.marginRight = "10px";
  this.el.style.cursor = "pointer";

  this.index = 0;

  var target = this;

  this.install = function()
  {
    this.el.innerHTML = "!";
    this.update();
  }

  this.override = function(id)
  {
    this.index = id;
    this.update();
  }

  this.update = function()
  {
    var target = this.choices[this.index % this.choices.length];
    this.el.innerHTML = this.name+" <b>"+target+"</b>";

    lobby.apps.marabu.instrument.set_control(this.id,this.index);
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