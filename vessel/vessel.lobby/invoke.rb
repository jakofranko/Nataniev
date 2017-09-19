#!/bin/env ruby
# encoding: utf-8

$nataniev.require("corpse","http")

$nataniev.vessels[:lobby].path = File.expand_path(File.join(File.dirname(__FILE__), "/"))
$nataniev.vessels[:lobby].install(:custom,:serve)

corpse = CorpseHttp.new($nataniev.vessels[:lobby])

corpse.add_meta("description","A design studio on a sailboat")
corpse.add_meta("keywords","sailing, patreon, indie games, design, liveaboard")
corpse.add_meta("viewport","width=device-width, initial-scale=1, maximum-scale=1")
corpse.add_meta("apple-mobile-web-app-capable","yes")

corpse.add_link("reset.css",:lobby)
corpse.add_link("font.input_mono.css",:lobby)
corpse.add_link("main.css",:lobby) 

corpse.add_script("core/jquery.js")
corpse.add_script("core/lobby.js")
corpse.add_script("core/commander.js")
corpse.add_script("core/keyboard.js")

corpse.add_script("core/app.setup.js")
corpse.add_script("core/app.window.js")
corpse.add_script("core/app.touch.js")
corpse.add_script("core/app.events.js")
corpse.add_script("core/app.node.js")
corpse.add_script("core/app.js")

$nataniev.vessels[:lobby].corpse = corpse

def corpse.query q = nil

  @body = "<script>var lobby = new Lobby(); lobby.init();</script>"

end