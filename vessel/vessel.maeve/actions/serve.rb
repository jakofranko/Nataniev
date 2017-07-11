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

    if q.like("init")
      return [
        {:host => "nataniev.maeve",:text => "Today is #{Desamber.new}."},
        {:host => "nataniev.maeve", :text => "The time is #{Desamber.new.clock}."}
      ].to_json
    else
      return [{:host => "nataniev.maeve",:text => "Unknown request"}].to_json
    end

  end

end