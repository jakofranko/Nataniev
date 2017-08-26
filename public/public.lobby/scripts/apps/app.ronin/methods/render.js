lobby.apps.ronin.methods.render = {name:"render",shortcut:"r",run_shortcut:true}

lobby.apps.ronin.render = function(param)
{
  var format = true ? 'image/jpeg' : 'image/png';
  var quality = 1;
  var content = this.layers.main.el.toDataURL(format,quality);
  var popup = window.open('about:blank','source');
  popup.document.write("<html><head><title>Export</title></head><body><img style='max-width:50%; display:block; margin:100px auto;' src='"+content+"'/></body></html>");
}

lobby.apps.ronin.setup.confirm("methods/render");