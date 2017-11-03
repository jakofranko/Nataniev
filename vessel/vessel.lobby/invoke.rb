#!/bin/env ruby
# encoding: utf-8

$nataniev.require("corpse","http")

$nataniev.vessels[:lobby].path = File.expand_path(File.join(File.dirname(__FILE__), "/"))
$nataniev.vessels[:lobby].install(:custom,:serve)

corpse = CorpseHttp.new($nataniev.vessels[:lobby])

def corpse.build
    add_meta("description","A design studio on a sailboat")
    add_meta("keywords","sailing, patreon, indie games, design, liveaboard")
    add_meta("viewport","width=device-width, initial-scale=1, maximum-scale=1")
    add_meta("apple-mobile-web-app-capable","yes")

    add_link("reset.css",:lobby)
    add_link("font.input_mono.css",:lobby)
    add_link("main.css",:lobby)

    add_script("core/jquery.js")
    add_script("core/lobby.js")
    add_script("core/commander.js")
    add_script("core/keyboard.js")

    add_script("core/app.setup.js")
    add_script("core/app.window.js")
    add_script("core/app.touch.js")
    add_script("core/app.events.js")
    add_script("core/app.node.js")
    add_script("core/app.js")
end

$nataniev.vessels[:lobby].corpse = corpse

def corpse.query q = nil

  @body = "<script>var lobby = new Lobby(); lobby.init();</script>"

end