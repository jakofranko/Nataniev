#!/bin/env ruby
# encoding: utf-8

module ActionSonar

  def sonar q = nil

    tries = 0
    parent = @parent
    while tries < 100
      code = $nataniev.parade.to_a[parent]["CODE"]
      if parent == code[5,5].to_i 
        if tries == 0
          return "! You are in the #{parent_vessel.name} ##{@parent}, at the stem of #{$nataniev.make_vessel(parent).print} universe."
        else
          return "! You are in the #{parent_vessel.name} ##{@parent}, #{tries} levels deep, within the #{$nataniev.make_vessel(parent).print} universe." 
        end
      end
      parent = code[5,5].to_i
      tries += 1
    end

    return "! You are in the #{parent_vessel.name}(##{@parent}), within a circular paradox."

  end

end