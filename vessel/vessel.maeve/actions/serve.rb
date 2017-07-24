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

    target = q.split(" ").first
    app = target.split(".").first
    met = target.split(".").last
    params = q.sub(target,"").strip

    if q.like("init")
      return [
        {:host => "nataniev.maeve",:text => "Today is #{Desamber.new}."},
        {:host => "nataniev.maeve", :text => "The time is #{Desamber.new.clock}."}
      ].to_json
    elsif q.include?("get_calendar")
      return get_calendar.to_json
    elsif q.include?("get_tasks")
      return get_tasks.to_json
    elsif q.like("help")
      return [{:host => "nataniev.maeve",:text => "Current options are get_calendar and get_tasks."}].to_json
    else
      return [{:host => "nataniev.maeve",:text => "Unknown request: #{q}"}].to_json
    end

  end

  def get_tasks

    payload = $nataniev.summon("oscean").new.act(:query,"tasks")

    a = []
    a.push({:host => "nataniev.maeve",:text => "Found #{payload.length} tasks.", :payload =>payload})
    payload.each do |text|
      a.push({:host => "nataniev.maeve",:text => "#{text}",:glyph => "-"})
    end
    return a

  end

  def get_calendar

    payload = $nataniev.summon("oscean").new.act(:query,"calendar")
    return [{:host => "nataniev.maeve",:text => "Found #{payload.length} logs.", :payload =>payload}]

  end

  def load_file path

    if File.exist?(path.gsub("-","/"))
      payload = File.read(path.gsub("-","/"), :encoding => 'UTF-8')
      return [{:host => "nataniev.maeve",:text => "Found file .", :payload =>payload}]
    end
    return [{:host => "nataniev.maeve",:text => "File not found."}]

  end

end