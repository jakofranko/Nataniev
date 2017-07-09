class Float
  
  def percent_of val
    
    v = (self/val.to_f) * 100
    return v
    
  end

  def trim lenght = 2

    return sprintf('%.'+lenght.to_s+'f', self)

  end
  
end