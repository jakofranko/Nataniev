function Rotonde()
{
  App.call(this);

  this.name = "rotonde";
  this.window.size = {width:600,height:300};
  this.window.pos = {x:30,y:30};
  this.window.theme = "blanc";

  this.methods.update = {name:"update"};
  this.methods.portal = {name:"portal"};
  this.methods.go = {name:"go"};
  this.methods.list = {name:"list"};
  this.methods.refresh = {name:"refresh"};
  this.rotonde = null;

  this.portals = [];

  this.setup.includes = ["portal"];

  this.setup.start = function()
  {
    // Select portals
    this.app.portals.push(new Rotonde_Portal("http://rotonde.v-os.ca"));
    this.app.portals.push(new Rotonde_Portal("http://rotonde-joshavanier.hashbase.io"));
    this.app.portals.push(new Rotonde_Portal("http://rotonde.v-os.ca"));
    this.app.portals.push(new Rotonde_Portal("http://rotonde.monochromatic.co"));
    this.app.portals.push(new Rotonde_Portal("http://rotonde.anxl.faith"));
    this.app.portals.push(new Rotonde_Portal("http://rotonde.electricgecko.de"));
    this.app.portals.push(new Rotonde_Portal("http://rotonde.attilam.com"));
    this.app.portals.push(new Rotonde_Portal("http://brennan-ltkmn.hashbase.io"));
    this.app.portals.push(new Rotonde_Portal("http://rotonde-ciel.hashbase.io"));
    this.app.portals.push(new Rotonde_Portal("http://rotonde.cblgh.org/network.json"));
    this.app.portals.push(new Rotonde_Portal("http://rotonde.neufv.website"));
    this.app.portals.push(new Rotonde_Portal("http://rotonde-somnius.hashbase.io"));

    update();
  }

  function update()
  {
    for(portal_id in lobby.apps.rotonde.portals){
      var portal = lobby.apps.rotonde.portals[portal_id];
      portal.install(lobby.apps.rotonde.wrapper_el);
    }
  }
}

lobby.summon.confirm("Rotonde");
