#!/bin/env ruby
# encoding: utf-8

require_relative "http.media.rb"
require_relative "http.string.rb"
require_relative "http.array.rb"

module CorpseHttp

  include Corpse

  attr_accessor :title
  attr_accessor :metas
  attr_accessor :body

  def build

    puts "Warning: Nothing to build"

  end

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

  # Title

  def body q = nil

    return @body ? @body : "Missing view"

  end

  # Inline Style

  def style

    @style = @style ? @style : []

    css = ""
    @style.each do |k,v|
      css += "#{k} {#{v}} "
    end

    return "<style>#{css}</style>"

  end

  def add_style k,v

    @style = @style ? @style : []
    @style.push([k,v])

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

    build

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
    #{body}
  </body>
  #{footers}
</html>"

  end

end
