lobby.apps.ide.methods.find = {name:"find", shortcut:"f", passive:true}

lobby.apps.ide.find = function(val, is_passive = false)
{
  var lines = this.textarea_el.value.split("\n");

  for(line_id in lines)
  {
    var line = lines[line_id];

    if(line.indexOf(val) == -1){  continue; }

    var from = this.textarea_el.value.indexOf(val);
    var to   = from + val.length;
    
    $(this.textarea_el).animate({scrollTop: line_id * 15}, 50, function() {
      if(!is_passive){
        lobby.apps.ide.textarea_el.setSelectionRange(from,to);
        lobby.apps.ide.textarea_el.focus();  
      }
    });

    return;
  
  }
  return false;
}

lobby.apps.ide.setup.confirm("methods/find");