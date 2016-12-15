#!/bin/env ruby
# encoding: utf-8

class Media

  def initialize(cat,id,url = nil)

    @id  = id.to_s.gsub(" ",".").downcase
    @cat = cat.to_s.downcase.gsub(" ",".")
    @host = $nataniev.vessel
    @path = "#{$nataniev.path}/public/public.#{@host.name.downcase}/media"
    @class = nil

  end

  attr_accessor :cat
  attr_accessor :path

  def exists

    if File.exist?("#{@path}/#{@cat}/#{@id}.jpg")
      return "jpg"
    elsif File.exist?("#{@path}/#{@cat}/#{@id}.png")
      return "png"
    elsif File.exist?("#{@path}/#{@cat}/#{@id}.mp4")
      return "mp4"
    elsif File.exist?("#{@path}/#{@cat}/#{@id}.svg")
      return "svg"
    end
    return nil

  end

  def set_class c

    @class = c

  end

  def set_style s

    @style = s

  end

  def to_s

    if @id.include?("youtube")
      return "<iframe src='https://www.youtube.com/embed/#{@id.split('v=').last}' frameborder='0' allowfullscreen style='#{@style}'></iframe>"
    elsif File.exist?("#{@path}/#{@cat}/#{@id}.mp4")
      return "<video #{@class ? "class='#{@class}'" : ""} style='#{@style}' autoplay loop><source src='public.#{@host.name.downcase}/media/#{@cat}/#{@id}.mp4' type='video/mp4'>Your browser does not support the video tag.</video>"
    elsif File.exist?("#{@path}/#{@cat}/#{@id}.jpg")
      return "<media #{@class ? "class='#{@class}'" : ""}  style='background-image:url(public.#{@host.name.downcase}/media/#{@cat}/#{@id}.jpg);#{@style}'></media>"
    elsif File.exist?("#{@path}/#{@cat}/#{@id}.png")
      return "<media #{@class ? "class='#{@class}'" : ""} style='background-image:url(public.#{@host.name.downcase}/media/#{@cat}/#{@id}.png);#{@style}'></media>"
    elsif File.exist?("#{@path}/#{@cat}/#{@id}.svg")
      return "<media #{@class ? "class='#{@class}'" : ""} style='background-image:url(public.#{@host.name.downcase}/media/#{@cat}/#{@id}.svg);#{@style}'></media>"
    end
    puts "<alert>Missing: #{@path}/#{@cat}/#{@id}</alert>"
    return ""

  end

  def debug

    return "[missing:#{@path}/#{@cat}/#{@id}:#{@class}]"

  end

end
