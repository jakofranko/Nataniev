lobby.apps.ide.methods.create = {name:"create", shortcut:"n"}

lobby.apps.ide.create = function(val, is_passive = false)
{
  this.view_editor();
  this.textarea_el.value = "Welcome to Ide";
}

lobby.apps.ide.setup.confirm("methods/create");