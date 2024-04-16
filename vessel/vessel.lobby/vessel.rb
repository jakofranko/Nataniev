class VesselLobby

  include Vessel

  def initialize

    super

    @name = "Lobby"
    @docs = "The Lobby is a web-based 'desktop' environment with several applications which can be used via a terminal."
    @path = File.expand_path(File.join(File.dirname(__FILE__), "/"))

    install(:generic, :serve)
    install(:generic, :help)

    build_corpse

  end

  def build_corpse

    # Build HTTP corpse
    $nataniev.require("corpse", "http")
    @corpse = CorpseHttp.new(self)
    @corpse.title = "The Lobby"

    def @corpse.build
        add_meta("description", "A design studio on a sailboat")
        add_meta("keywords", "sailing, patreon, indie games, design, liveaboard")
        add_meta("viewport", "width=device-width, initial-scale=1, maximum-scale=1")
        add_meta("apple-mobile-web-app-capable", "yes")

        add_link("reset.css", :lobby)
        add_link("font.input_mono.css", :lobby)
        add_link("main.css", :lobby)

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

    def @corpse.query q = nil

      @body = "<script>var lobby = new Lobby(); lobby.init();</script>"

    end

  end

end
