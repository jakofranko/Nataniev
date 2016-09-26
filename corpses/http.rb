#!/bin/env ruby
# encoding: utf-8

module CorpseHttp

  include Corpse

  # Metas

  def metas

    return "<meta charset='UTF-8'>#{@metas}"

  end

  def add_meta name, content

    @metas = !@metas ? "" : @metas
    @metas += "<meta name='#{name}' content='#{content}' />"

  end

  # Scripts

  def scripts

    return "#{@scripts}"

  end

  def add_script name

    @scripts = !@scripts ? "" : @scripts
    @scripts += "<script src='scripts/#{name}'></script>"

  end

  # Links

  def links

    return "#{@links}"

  end

  def add_link rel = 'stylesheet', type = 'text/css', name

    @links = !@links ? "" : @links
    @links += name.include?("http://") ? "<link rel='#{rel}' type='#{type}' href='#{name}' />" :  "<link rel='#{rel}' type='#{type}' href='links/#{name}' />"

  end

  # Title

  def title q = nil

    return @title ? "<title>#{@title}</title>" : "<title>Missing title</title>"

  end

  def set_title name

    @title = name

  end

  # Title

  def view q = nil

    return @view ? @view : "Missing view"

  end

  def set_view view

    @view = view

  end

  # Inline Style

  def style

    return "<style>#{@style}</style>"

  end

  def set_style style_array

    @style = style_array

  end

  # Footers

  def footers

    return @footers

  end

  def add_footer html

    @footers = !@footers ? "" : @footers
    @footers += html

  end

  # Output

  def result

    return "
<!DOCTYPE html>
<html> 
  <head>
    #{metas}
    #{scripts}
    #{links}
    #{title}
    #{style}
  </head>
  <body>
    #{view}
  </body>
  #{footers}
</html>"

  end

end

class Media

  def initialize(cat,id,url = nil)

      @id  = id.to_s.downcase.gsub(" ",".")
      @cat = cat.to_s.downcase.gsub(" ",".")
      @class = nil

  end

  def exists

    if File.exist?("/var/www/client.oscean/media/#{@cat}/#{@id}.jpg")
      return "jpg"
    elsif File.exist?("/var/www/client.oscean/media/#{@cat}/#{@id}.png")
      return "png"
    elsif File.exist?("/var/www/client.oscean/media/#{@cat}/#{@id}.mp4")
      return "mp4"
    end
    return nil

  end

  def set_class c

    @class = c

  end

  def to_html

    if File.exist?("/var/www/client.oscean/media/#{@cat}/#{@id}.mp4")
      return "<video #{@class ? "class='#{@class}'" : ""} autoplay loop><source src='/media/#{@cat}/#{@id}.mp4' type='video/mp4'>Your browser does not support the video tag.</video>"
    elsif File.exist?("/var/www/client.oscean/media/#{@cat}/#{@id}.jpg")
      return "<media #{@class ? "class='#{@class}'" : ""}  style='background-image:url(/media/#{@cat}/#{@id}.jpg)'></media>" 
    elsif File.exist?("/var/www/client.oscean/media/#{@cat}/#{@id}.png")
      return "<media #{@class ? "class='#{@class}'" : ""} style='background-image:url(/media/#{@cat}/#{@id}.png)'></media>" 
    end
    return "[missing:#{@id}:#{@cat}:#{@class}]"

  end

end
