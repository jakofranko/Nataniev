lobby.apps.ide.methods.spellcheck = {name:"spellcheck", shortcut:"i", run_shortcut:true}

lobby.apps.ide.spellcheck = function(val, is_passive = false)
{
  this.textarea_el.spellcheck = !this.textarea_el.spellcheck ? true : false;
  lobby.commander.notify("Spellcheck: "+this.textarea_el.spellcheck);
}

lobby.apps.ide.setup.confirm("methods/spellcheck");