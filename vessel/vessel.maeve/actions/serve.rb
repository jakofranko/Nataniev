#!/bin/env ruby
# encoding: utf-8

require 'json'

class ActionServe

  include Action

  def initialize q = nil

    super

    @name = "Serve"
    @docs = "Deliver html documentation."

  end
  
  def act q = ""

    q = q.sub(":maeve+",'').gsub("+"," ")

    return {:host => "nataniev.maeve",:text => "Request(#{q})"}.to_json

  end

end