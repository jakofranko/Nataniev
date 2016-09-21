#!/bin/env ruby
# encoding: utf-8

module ActionInventory

  include Action
  
  def inventory q = nil

    if @actor.inventory_vessels.length == 0 then return error_empty end

    text = ""
    @actor.inventory_vessels.each do |vessel|    
      text += "- #{vessel.print}"
    end

    return text
    
  end

end