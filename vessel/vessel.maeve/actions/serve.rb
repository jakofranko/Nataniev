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
    elsif q.like("calendar.get_logs")
      return [{:host => "nataniev.maeve",:text => "Found logs", :data =>calendar_logs}].to_json
    else
      return [{:host => "nataniev.maeve",:text => "Unknown request: #{q}"}].to_json
    end

  end

  def calendar_logs

    return $nataniev.summon("oscean").new.act(:query,"logs")

  end

end