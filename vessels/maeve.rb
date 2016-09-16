#!/bin/env ruby
# encoding: utf-8

class Maeve # TODO

  include Vessel

  def id ; return 50 end
  def name ; return "Maeve" end
  def print ; return "Maeve" end
  def set_parent val ; @parent = val ; save ; return true end

  def __look q = nil

    return act

  end

  def auto q = nil # TODO

    return act

  end

  def act

    maeve = $nataniev.make_vessel(50)

    maeve.visible_vessels.each do |vessel|
      if vessel.class != Basic.new.class && vessel.class != Ghost.new.class then next end
      if vessel.rating < 2 then return act_destroy(vessel) end
      if vessel.class == Ghost.new.class then return act_throw(vessel) end
    end

    return act_move

  end

  def act_destroy vessel

    vessel.destroy
    return "Destroy #{vessel.name}."

  end

  def act_throw vessel

    vessel.set_parent(25)
    return "Threw #{vessel.name} to the residences."

  end

  def act_move

    maeve = $nataniev.make_vessel(50)

    if maeve.parent_vessel.id == maeve.parent_vessel.parent
      target = $nataniev.find_random_vessel
      maeve.set_parent(target.id)
      return "Warped to #{target.name}()."
    else
      maeve.set_parent(maeve.parent_vessel.parent)
      return "Moved to #{maeve.parent_vessel.parent_vessel.name}."
    end

  end

end