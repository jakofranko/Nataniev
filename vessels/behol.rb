#!/bin/env ruby
# encoding: utf-8

class Behol # TODO

  include Vessel

  class Actions

    include ActionCollection

    include ActionHttp

  end

  def actions ; return Actions.new(self,self) end
  
end