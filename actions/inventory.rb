#!/bin/env ruby
# encoding: utf-8

module ActionInventory

  def inventory q = nil

    if inventory_vessels.length == 0 then return error_empty end

    text = ""
    inventory_vessels.each do |vessel|    
      text += "- #{vessel.print}"
    end

    return text
    
  end

end