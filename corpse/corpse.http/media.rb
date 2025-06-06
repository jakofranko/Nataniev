#!/bin/env ruby

# For rendering media tags
class Media

  attr_accessor :cat

  MEDIA_TAG = %(
    <media %<class>s style='background-image:url(%<path>s.%<format>s);%<style>s'></media>
  ).freeze

  def initialize(cat, id, cl = '')

    @id  = id.to_s.gsub(' ', '.').downcase
    @cat = cat.to_s.downcase.gsub(' ', '.')
    @class = cl

  end

  def exists

    if File.exist?("#{path}/#{@cat}/#{@id}.jpg")
      return 'jpg'
    elsif File.exist?("#{path}/#{@cat}/#{@id}.png")
      return 'png'
    elsif File.exist?("#{path}/#{@cat}/#{@id}.mp4")
      return 'mp4'
    elsif File.exist?("#{path}/#{@cat}/#{@id}.svg")
      return 'svg'
    end

    nil

  end

  def set_class(c)

    @class = c

  end

  def set_style(s)

    @style = s

  end

  def to_s

    c = @class ? "class='#{@class}'" : ''
    p = "#{path.split('public/').last}/#{@cat}/#{@id}"

    if File.exist?("#{p}.mp4")
      return %(
        <video #{c} style='#{@style}' autoplay loop>
          <source src='#{p}.mp4' type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      )
    elsif File.exist?("#{p}.jpg")
      return format(MEDIA_TAG, path: p, format: 'jpg', class: c, style: @style)
    elsif File.exist?("#{p}.png")
      return format(MEDIA_TAG, path: p, format: 'png', class: c, style: @style)
    elsif File.exist?("#{p}.svg")
      return format(MEDIA_TAG, path: p, format: 'svg', class: c, style: @style)
    end

    puts "<alert>Missing: #{path}/#{@cat}/#{@id}</alert>"
    ''

  end

  def to_img

    if File.exist?("#{path}/#{@cat}/#{@id}.jpg")
      return %(<img src="#{path.split('public/').last}/#{@cat}/#{@id}.jpg" />)
    elsif File.exist?("#{path}/#{@cat}/#{@id}.png")
      return %(<img src="#{path.split('public/').last}/#{@cat}/#{@id}.png" />)
    end

    nil

  end

  def debug

    "[missing:#{path}/#{@cat}/#{@id}:#{@class}]"

  end

end
