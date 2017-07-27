function Diary()
{
  App.call(this);

  this.name = "diary";
  this.size = {width:300,height:300};
  this.origin = {x:120,y:120};
  this.methods.find = {name:"find", shortcut:"f"};
}

lobby.install_callback("Diary");
