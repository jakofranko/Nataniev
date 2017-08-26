# Nataniev

Nataniev is an operating system inspired from original MUDs, it hosts various websites and applications of the [Oscean Ecosystem](http://wiki.xxiivv.com/Nataniev).

## The Lobby

The lobby is the Nataniev graphical interface. Upon cloning the repository, [install the Sinatra Gem](https://www.digitalocean.com/community/tutorials/how-to-install-and-get-started-with-sinatra-on-your-system-or-vps).
```
ruby nataniev.server.rb lobby   # Will start localhost
```

Now open your browser to:
```
http://localhost:8668/
```

You should be presented with the Lobby. Have a look at the [Lobby Guide](http://wiki.xxiivv.com/Lobby) on how to use Nataniev applications.

## Starting

There are 3 main ways of launching Nataniev.

```
ruby nataniev.server VESSEL                 # Will start sinatra and serve the vessels.
ruby nataniev.operator.rb VESSEL ACTION     # Will return a response and alt.
ruby nataniev.auto                          # Will not return a response, instead, write logs.
```

## Paradigm

An application is made of 4 parts.

### Vessel

A **vessel** is an application type, that can contain actions, corpses and memories. Vessels can also have public files.

```
/core/vessel/vessel.oscean
/public/public.oscean
```

### Action

An **action** is a command installed onto a vessel during vessel initialization(vessel.rb).

```
install(:generic,:help)
```

### Memory

A **memory** is either a array or hash type file, containing data accessible by the vessel.

### Corpse

A **corpse** is a framework that handles a response from an action.

```
corpse         = CorpseHttp.new(@host,@query)
corpse.title   = "Html Page Title"
```
