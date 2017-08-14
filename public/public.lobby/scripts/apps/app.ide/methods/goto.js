lobby.apps.ide.methods.goto = {name:"goto", shortcut:"g"}
lobby.apps.ide.methods.go_up = {name:"go_up", shortcut:"z", run_shortcut:true};
lobby.apps.ide.methods.go_down = {name:"go_down", shortcut:"x", run_shortcut:true};

lobby.apps.ide.goto = function(line_id)
{
  var lines = this.textarea_el.value.split("\n");
  var target_block = lines.splice(0,line_id).join("\n");
  lobby.apps.ide.textarea_el.focus();
  $(lobby.apps.ide.textarea_el).animate({scrollTop: (line_id - 3) * 15}, 100, function(){ 
    lobby.apps.ide.textarea_el.setSelectionRange(target_block.length+1,target_block.length+1); 
  });
}

lobby.apps.ide.go_up = function()
{
  var lines = this.textarea_el.value.split("\n");
  var line_id = this.textarea_el.value.substr(0,this.textarea_el.selectionEnd).split("\n").length;
  var target_block = lines.splice(0,line_id - 5).join("\n");

  this.textarea_el.setSelectionRange(target_block.length+1,target_block.length+1);
  this.textarea_el.focus();
  $(this.textarea_el).animate({scrollTop: (line_id - 8) * 15}, 100, function() {});
}

lobby.apps.ide.go_down = function()
{
  var lines = this.textarea_el.value.split("\n");
  var line_id = this.textarea_el.value.substr(0,this.textarea_el.selectionEnd).split("\n").length;
  var target_block = lines.splice(0,line_id + 5).join("\n");

  this.textarea_el.setSelectionRange(target_block.length+1,target_block.length+1);
  this.textarea_el.focus();
  $(this.textarea_el).animate({scrollTop: (line_id + 3) * 15}, 100, function() {});
}

lobby.apps.ide.setup.confirm("methods/goto");