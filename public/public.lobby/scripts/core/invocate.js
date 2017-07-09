function Invocate()
{

  this.invoke_script = function(folder,target)
  {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = folder+'/'+target+'.js';
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  this.invoke_style = function(folder,target)
  {
    var s = document.createElement('link');
    s.type = 'text/css';
    s.href = folder+'/'+target+'.css';
    s.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(s);
  }
}