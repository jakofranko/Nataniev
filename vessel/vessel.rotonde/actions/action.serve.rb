#!/bin/env ruby
# encoding: utf-8

require 'json'

class ActionServe

  include Action

  def initialize q = nil

    super

    @name = "Serve"
    @docs = "Serve a distant instance."

  end

  def act q = nil
    
    load_folder("#{@host.path}/objects/*")

    ro = Rotonde.new
    
    ro.name = "Devine Lu Linvega"
    ro.location = $nataniev.answer("hundredrabbits get_location")
    ro.position = $nataniev.answer("hundredrabbits get_position")
    ro.avatar = "http://wiki.xxiivv.com/public.oscean/media/brand/logo.devine.lu.linvega.png"
    ro.color = "#72dec2"
    ro.glyph = "M240,240 l0,-90 a-90,-90 0 0,0 -90,-90 l-90,0 l0,90 a90,90 0 0,0 90,90 l60,0 l0,-90 a-60,-60 0 0,0 -60,-60 l-60,0 l0,60 a60,60 0 0,0 60,60 l30,0 l0,-60 a-30,-30 0 0,0 -30,-30 l-30,0 l0,30 a30,30 0 0,0 30,30"

    ro.feed = logs
    ro.portal.push("http://rotonde.monochromatic.co")
    ro.portal.push("http://rotonde.cblgh.org")
    ro.portal.push("http://rotonde.anxl.faith")
    ro.portal.push("http://rotonde.electricgecko.de")
    ro.portal.push("http://rotonde.attilam.com")
    ro.portal.push("http://rotonde.brennan.pizza")
    ro.portal.push("https://rotonde-joshavanier.hashbase.io")
    
    return ro.to_json
    
  end

  def logs

    a = []
    count = 0
    Memory_Array.new("horaire","#{@host.path}/../vessel.oscean").to_a.each do |log|
      if count > 30 then break end
      topic = log["TERM"].to_s
      text = log["TEXT"]
      media = log["PICT"].to_i
      focus = log["CODE"][3,1].to_i
      sector = sector(log["CODE"][2,1].to_i).to_s.capitalize
      task = log["TASK"].to_s

      entry = {}
      entry[:time] = Timestamp.new(log["DATE"]).unix.to_s
      entry[:text] = text ? text.gsub("{{","").gsub("}}","") : "#{topic} #{task}, for #{focus}h."
      entry[:data] = {:focus => focus/10.0, :task => task.downcase, :topic => topic.downcase, :sector => sector.downcase}

      if media > 0 then entry[:media] = "http://wiki.xxiivv.com/public.oscean/media/diary/#{media}.jpg" end
      if topic.to_s != "" then entry[:url] = "http://wiki.xxiivv.com/#{topic}" end

      a.push(entry)
      count += 1 
    end
    return a

  end

  def sector code

    if code == 1 then return :audio end
    if code == 2 then return :visual end
    if code == 3 then return :research end

    return :misc
    
  end

end