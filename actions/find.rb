#!/bin/env ruby
# encoding: utf-8

module ActionFind

   def find q = nil 

    if q.split(" ").first == "my"
      vessel = find_owned_vessel(q.sub("my ",''))
    else q.split(" ").first == "the"
      vessel = find_any_vessel(q.sub("my ",''))
    end

    if !vessel then return "! There are no vessel named \"#{q}\"." end
    if vessel.is_hidden then return "! The #{vessel.print} is hidden and cannot be located." end

    return "! {{#{vessel.print.capitalize}}} is located at #{vessel.parent}."

  end

end