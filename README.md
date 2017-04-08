# Nataniev

Nataniev is an operating system inspired from original MUDs, it hosts various websites and applications of the [Oscean Ecosystem](http://wiki.xxiivv.com/Nataniev).

## Starting

There are 3 main ways of launching Nataniev.

```
ruby nataniev.operator (query)  # Will return a response and alt.
ruby nataniev.console  (query)  # Will return a response and keep the STDIN loop active.
ruby nataniev.auto              # Will not return a response, instead, write logs.
ruby nataniev.server            # Will start sinatra and serve the vessels.
```
## Paradigm

An application is made of 4 parts.

### Vessel

A **vessel** is an application type, that can contain actions, corpses and memories.

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