function Rotonde()
{
  App.call(this);

  this.name = "rotonde";
  this.size = {width:600,height:300};
  this.origin = {x:30,y:30};

  this.methods.update = {name:"update"};
  this.methods.portal = {name:"portal"};
  this.methods.go = {name:"go"};
  this.methods.list = {name:"list"};
  this.methods.refresh = {name:"refresh"};
  this.rotonde = null;

  this.includes = ["instance"];

  this.on_launch = function()
  {
    this.wrapper_el.innerHTML = "Loading feed..";

    this.rotonde = JSON.parse('{"profile":{"name":"Devine Lu Linvega","location":"Huahine","avatar":"http://wiki.xxiivv.com/public.oscean/media/brand/logo.devine.lu.linvega.png","color":"#72dec2"},"feed":[{"time":"1498017600","text":"Started the Rotonde experiment.","url":"http://wiki.xxiivv.com/Rotonde}"},{"time":"1497931200","text":"Started building an IDE to build Nataniev within itself.","url":"http://wiki.xxiivv.com/Lobby}"},{"time":"1497844800","url":"http://wiki.xxiivv.com/Lobby}"},{"time":"1497758400","url":"http://wiki.xxiivv.com/Lobby}"},{"time":"1497672000","text":"Began created a frontend to the Nataniev server.","url":"http://wiki.xxiivv.com/Lobby}"},{"time":"1497585600","text":"Update the Ronin logo to a more simple design.","url":"http://wiki.xxiivv.com/Ronin}"},{"time":"1497499200","url":"http://wiki.xxiivv.com/Marabu}"},{"time":"1497412800","url":"http://wiki.xxiivv.com/Oquonie}"},{"time":"1497326400","url":"http://wiki.xxiivv.com/Marabu}"},{"time":"1497240000","url":"http://wiki.xxiivv.com/Marabu}"},{"time":"1497153600","url":"http://wiki.xxiivv.com/Marabu}"},{"time":"1497067200","media":"http://wiki.xxiivv.com/public.oscean/media/diary/194.jpg","url":"http://wiki.xxiivv.com/Marabu}"},{"time":"1496980800","url":"http://wiki.xxiivv.com/Marabu}"},{"time":"1496894400","url":"http://wiki.xxiivv.com/Oquonie}"},{"time":"1496808000","url":"http://wiki.xxiivv.com/Horaire}"},{"time":"1496721600","url":"http://wiki.xxiivv.com/Horaire}"},{"time":"1496635200","url":"http://wiki.xxiivv.com/Hundred rabbits}"},{"time":"1496548800","url":"http://wiki.xxiivv.com/Hundred rabbits}"},{"time":"1496462400","url":"http://wiki.xxiivv.com/Horaire}"},{"time":"1496376000","url":"http://wiki.xxiivv.com/Known magye}"},{"time":"1496289600","url":"http://wiki.xxiivv.com/Aliceffekt}"},{"time":"1496203200","media":"http://wiki.xxiivv.com/public.oscean/media/diary/10.jpg","url":"http://wiki.xxiivv.com/Collected works}"},{"time":"1496116800","media":"http://wiki.xxiivv.com/public.oscean/media/diary/179.jpg","url":"http://wiki.xxiivv.com/Children of bramble}"},{"time":"1496030400","url":"http://wiki.xxiivv.com/Dinaisth}"},{"time":"1495944000","url":"http://wiki.xxiivv.com/Dei dain}"},{"time":"1495857600","url":"http://wiki.xxiivv.com/Ronin}"},{"time":"1495771200","url":"http://wiki.xxiivv.com/Ronin}"},{"time":"1495684800","url":"http://wiki.xxiivv.com/Ronin}"},{"time":"1495598400","url":"http://wiki.xxiivv.com/Ronin}"},{"time":"1495512000","url":"http://wiki.xxiivv.com/Ronin}"},{"time":"1495425600","text":"Updated {{Ronin}} with a major design overhaul and various functionality improvements. It includes the ability to save & load .rin files. I have also updated the logo to fit within the {{Gamme}} ecosystem.","media":"http://wiki.xxiivv.com/public.oscean/media/diary/168.jpg","url":"http://wiki.xxiivv.com/Ronin}"}],"portal":["rotonde.monochromatic.co","rotonde.cblgh.org","rotonde.anxl.faith","johnakers.network/rotonde.json"]}');
    // this.get_url("http://rotonde.xxiivv.com");

    this.create_feed();
  }

  this.get_url_callback = function(url,r)
  {
    console.log(url);
    this.rotonde = r;
  }

  this.create_feed = function()
  {
    this.portals = [];

    this.portals.push(new Rotonde_Instance("johnakers.network/rotonde.json"));
    this.portals.push(new Rotonde_Instance("rotonde.cblgh.org"));
    this.portals.push(new Rotonde_Instance("rotonde.monochromatic.co"));
    this.portals.push(new Rotonde_Instance("rotonde.brennan.pizza/feed.json"));
    this.portals.push(new Rotonde_Instance("rotonde.anxl.faith"));
    this.portals.push(new Rotonde_Instance("rotonde.electricgecko.de"));
    this.portals.push(new Rotonde_Instance("rotonde.attilam.com"));
    
    // this.portals.push(new Rotonde_Instance("rotonde.xxiivv.com"));

    this.wrapper_el.innerHTML = "";

    for(portal_id in this.portals){
      var portal = this.portals[portal_id];
      portal.init();
      this.wrapper_el.appendChild(portal.el);
    }
  }
}

lobby.summon.confirm("Rotonde");
