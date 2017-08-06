function App()
{
  App_Setup.call(this);
  App_Window.call(this);
  App_Touch.call(this);
  App_Events.call(this);

	this.name = "global";

  this.methods = {};
  this.methods.default = {name:"default",is_global:true};
  this.methods.exit = {name:"exit",is_global:true,shortcut:"w",run_shortcut:true};

	this.el = document.createElement("app");
	this.wrapper_el = document.createElement("yu"); this.wrapper_el.className = "wrapper";
	this.el.appendChild(this.wrapper_el);

  this.default = function()
  {
    this.window.show();
  }

  this.toggle = function()
  {
    this.window.toggle();
  }

  this.hint = function(value)
  {
    var html = "";
    var method = value.indexOf(".") > -1 ? value.split(".")[1].split(" ")[0] : null;

    // Autocomplete
    for(method_id in this.methods){
      if(this.methods[method_id].is_global){continue; }
      var method_name = this.methods[method_id].name;
      if(method_name.indexOf(method) > -1){
        html += "<t class='autocomplete'>"+method_name.replace(method,'')+"</t>";
        lobby.commander.autocomplete = this.name+"."+method_name+" ";
        break;
      }
    }

    if(this.methods[method]){
      return "<span class='param'> "+(this.methods[method].params ? ' > '+this.methods[method].params : ' > ')+"</span> ";
    }
    for(method_id in this.methods){
      var method = this.methods[method_id];
      if(method.is_global){ continue; }
      html += " <span class='method'>."+method_id+(method.shortcut ? '('+method.shortcut+')' :'')+"</span> ";
    }
    for(method_id in this.methods){
      var method = this.methods[method_id];
      if(!method.is_global){ continue; }
      html += " <span class='method global'>."+method_id+(method.shortcut ? '('+method.shortcut+')' :'')+"</span> ";
    }
    return html;
  }

  this.status = function()
  {
    return "Idle.";
  }

  this.call = function(method,params = null,vessel = this.name)
  {
    var app = this;
    var url = ("http://localhost:8668/:maeve "+(vessel ? vessel+"."+method+' ' : '')+(params ? params : "")).trim().replace(/ /g, '+'); 
    console.log("Calling..",url)
    $.get(url).done(function(response){
      try {
        var a = JSON.parse(response);
      } catch(e) {
        console.log(e,response);
      }
      if(a){
        app.call_back(method,a)  
      }
      
    },"json");
  }

  this.call_back = function(m,r)
  {
    console.log(this.name+"."+m+" answered",r);
  }

  this.get_url = function(url)
  {
    var app = this;
    lobby.apps.util.log(url);
    $.get(url, function( data ){
      console.log(data);
      app.get_url_callback(url,JSON.parse(data))
    }); 
  }

  this.get_url_callback = function(url,r)
  {
    console.log(this.name+"."+url+" answered",r);
  }

  this.el.addEventListener("mousedown", this.touch.down, false);
  this.el.addEventListener("mouseup", this.touch.up, false);
  this.el.addEventListener("mousemove", this.touch.move, false);

  this.wrapper_el.addEventListener("mousedown", function(e){ e.stopPropagation(); }, false);
}
