#!/bin/env ruby
# encoding: utf-8

require $nataniev.path+"/core/vessel.rb"

$nataniev.require("action","help")

class Ghost # TODO

  include Vessel

  attr_accessor :default_actions

  class DefaultActions
    
    include ActionCollection
    include ActionHelp

  end

  def default_actions ; return DefaultActions.new($nataniev.actor,self) end

end