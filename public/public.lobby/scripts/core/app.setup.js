function App_Setup()
{
  var target = this;

  this.setup = 
  {
    app : target,
    includes : [],
    queue : [],
    has_launched : false,
    is_complete : false,

    install : function()
    {
      this.queue = this.includes;

      for(file_id in this.includes){
        this.inject(this.includes[file_id]);
      }

      if(this.includes.length == 0){
        this.complete();
      }
    },

    inject : function(name)
    {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = 'public.lobby/scripts/apps/app.'+this.app.name+'/'+name+'.js';
      document.getElementsByTagName('head')[0].appendChild(s);
    },

    confirm : function(name)
    {
      var q = [];
      for(module_id in this.queue){
        if(name == this.queue[module_id]){ continue; }
        q.push(this.queue[module_id]);
      }
      this.queue = q;
      if(this.queue.length == 0){ this.complete();  }
    },

    complete : function()
    {
      this.is_complete = true;
      this.ready();
      lobby.summon.update();
    },

    ready : function()
    {
      console.log("ready",this.app.name)
    },

    launch : function()
    {
      if(this.has_launched == true){ return; }

      console.log("launch",this.app.name);

      lobby.el.appendChild(this.app.el);
      this.start();
      this.has_launched = true;
      this.app.window.start();
    },

    start : function()
    {
      console.info("start",this.app.name)
    },

    exit : function()
    {
      console.log("exit",this.app.name)
    }
  }
}