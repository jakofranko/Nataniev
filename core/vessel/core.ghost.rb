#!/bin/env ruby
# encoding: utf-8

require $nataniev.path+"/core/vessel.rb"

class Ghost # TODO

  include Vessel

  class DefaultActions
    include ActionCollection
    include ActionHelp
  end

  def default_actions ; return DefaultActions.new($nataniev.actor,self) end
  
end