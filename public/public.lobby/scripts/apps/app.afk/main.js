function Afk()
{
	App.call(this);

  this.name = "afk";
  this.size = {width:300,height:300};
  this.origin = {x:120,y:120};
  this.theme = "blanc";
}

lobby.install_callback("Afk");
