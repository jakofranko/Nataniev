lobby.apps.ronin.methods.clear = {name:"clear",shortcut:"n"}

lobby.apps.ronin.clear = function(param)
{
  this.project.size = {width:300,height:300};
  this.project.zoom = 0.5;

  this.resize(this.project.size);

  lobby.commander.update_status();
}

lobby.apps.ronin.setup.confirm("methods/clear");