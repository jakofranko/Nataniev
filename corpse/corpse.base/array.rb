#!/bin/env ruby
# encoding: utf-8

class Array
  
  def sum
 
    val = 0
    self.each do |v|
      val += v
    end
    return val

  end

  def average
    
    return sum/self.length.to_f

  end

end
