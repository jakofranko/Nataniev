#!/bin/env ruby
# encoding: utf-8

#!/bin/env ruby
# encoding: utf-8

$nataniev.require("corpse","http")
$nataniev.require("corpse","json")

$nataniev.vessels[:rotonde].path = File.expand_path(File.join(File.dirname(__FILE__), "/"))
$nataniev.vessels[:rotonde].install(:custom,:serve)

corpse = CorpseJson.new($nataniev.vessels[:rotonde])

$nataniev.vessels[:rotonde].corpse = corpse

def corpse.query q = nil

  load_folder("#{$nataniev.vessels[:rotonde].path}/objects/*")

  ro = Rotonde.new
  
  ro.name = "Devine Lu Linvega"
  ro.location = $nataniev.answer("hundredrabbits get_location")
  ro.position = $nataniev.answer("hundredrabbits get_position")
  ro.avatar = "http://wiki.xxiivv.com/public.oscean/media/brand/logo.devine.lu.linvega.png"
  ro.color = "#72dec2"
  ro.glyph = "M240,240 l0,-90 a-90,-90 0 0,0 -90,-90 l-90,0 l0,90 a90,90 0 0,0 90,90 l60,0 l0,-90 a-60,-60 0 0,0 -60,-60 l-60,0 l0,60 a60,60 0 0,0 60,60 l30,0 l0,-60 a-30,-30 0 0,0 -30,-30 l-30,0 l0,30 a30,30 0 0,0 30,30"

  ro.feed = logs
  ro.portal.push("http://rotonde.monochromatic.co")
  ro.portal.push("http://rotonde.anxl.faith")
  ro.portal.push("http://rotonde.electricgecko.de")
  ro.portal.push("http://rotonde.attilam.com")
  ro.portal.push("http://brennan-ltkmn.hashbase.io")
  ro.portal.push("http://rotonde-ciel.hashbase.io")
  ro.portal.push("http://rotonde.cblgh.org/network.json")
  ro.portal.push("http://rotonde.neufv.website")
  ro.portal.push("http://rotonde.v-os.ca")
  ro.portal.push("http://rotonde-joshavanier.hashbase.io")
  ro.portal.push("http://rotonde-somnius.hashbase.io")
  
  @payload = ro

end

def corpse.logs

  logs = Memory_Array.new("horaire","#{@host.path}/../vessel.oscean").to_a
  a = []
  count = 0

  logs.each do |log|
    if count > 30 then break end
    topic = log["TERM"].to_s
    text = log["TEXT"]
    media = log["PICT"].to_i
    focus = log["CODE"][3,1].to_i
    sector = sector(log["CODE"][2,1].to_i).to_s.capitalize
    task = log["TASK"].to_s

    entry = {}
    entry[:time] = Timestamp.new(log["DATE"]).unix.to_s
    entry[:text] = text ? text.gsub("{{","").gsub("}}","") : "#{topic} #{task}"
    entry[:data] = {:focus => focus/10.0, :task => task.downcase, :topic => topic.downcase, :sector => sector.downcase}

    if media > 0 then entry[:media] = "http://wiki.xxiivv.com/public.oscean/media/diary/#{media}.jpg" end
    if topic.to_s != "" then entry[:url] = "http://wiki.xxiivv.com/#{topic}".to_url end

    a.push(entry)
    count += 1 
  end
  return a

end

def corpse.sector code

  if code == 1 then return :audio end
  if code == 2 then return :visual end
  if code == 3 then return :research end

  return :misc
  
end