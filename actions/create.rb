#!/bin/env ruby
# encoding: utf-8

module ActionCreate

  def create q = nil

    q = " #{q} ".sub(" a ","").sub(" an ","").sub(" the ","").strip

    _name      = q.split(" ").last
    _attribute = q.split(" ").length > 1 ? q.split(" ").first : ""

    if _name.length > 14      then return "! Names cannot exceed 14 characters in length." end
    if _attribute.length > 14 then return "! Attributes cannot exceed 14 characters in length." end

    new_vessel = Basic.new($nataniev.find_available_id,{'CODE' => "0000-#{@actor.parent.to_s.prepend("0",5)}-#{@actor.id.to_s.prepend("0",5)}-BASIC-#{Timestamp.new.to_s}", 'NAME' => _name, 'ATTR' => _attribute})
    new_vessel.save

    return "! You created #{new_vessel.print}."
    
  end

end