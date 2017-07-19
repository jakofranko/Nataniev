function Calendar()
{
	App.call(this);

  this.name = "calendar";
  this.size = {width:210,height:210};
  this.origin = {x:120,y:120};
  this.widget_el = document.createElement("t");

}

lobby.install_callback("Calendar");