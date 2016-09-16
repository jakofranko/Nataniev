#!/bin/env ruby
# encoding: utf-8

module ActionExamine

  def examine q = nil

    return sonar(@target)
    
  end

  private

  def sonar v = nil

    tries = 0
    parent = v.id
    while tries < 100
      code = $nataniev.parade.to_a[parent]["CODE"]
      if parent == code[5,5].to_i 
        if tries == 0
          return "! The #{v.name} is at the stem of #{$nataniev.make_vessel(parent).print} universe."
        else
          return "! The #{v.name} is #{tries} levels deep, within the #{$nataniev.make_vessel(parent).print} universe." 
        end
      end
      parent = code[5,5].to_i
      tries += 1
    end

    return "! The #{v.name}(##{v.id}), is within a circular paradox."

  end

end