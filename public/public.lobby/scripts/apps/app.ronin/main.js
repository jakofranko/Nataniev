function Ronin()
{
  App.call(this);

  this.name = "ronin";
  this.size = {width:300,height:300};
  this.origin = {x:120,y:120};
}

lobby.install_callback("Ronin");
