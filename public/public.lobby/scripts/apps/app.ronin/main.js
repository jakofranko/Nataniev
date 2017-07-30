function Ronin()
{
  App.call(this);

  this.name = "ronin";
  this.size = {width:300,height:300};
  this.origin = {x:120,y:120};

  this.includes = ["new","brush","path","import","load","resize","type","magnet","load"];

  this.on_launch = function()
  {
    this.new();
  }
}

lobby.install_callback("Ronin");