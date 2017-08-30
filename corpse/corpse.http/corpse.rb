#!/bin/env ruby
# encoding: utf-8

require_relative "media.rb"
require_relative "string.rb"
require_relative "array.rb"
require_relative "progress.rb"

class CorpseHttp

  include Corpse

  attr_accessor :title
  attr_accessor :metas
  attr_accessor :body
  attr_accessor :style

  def initialize host

    @host = host
    @style = ""
    @body  = ""
    @footers = ""

  end

  # Override

  def query q = nil; end

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

  def add_script name, vessel_name = @host.name

    @scripts = !@scripts ? "" : @scripts
    @scripts += "<script src='public.#{vessel_name.downcase}/scripts/#{name}'></script>"

  end

  # Links

  def links

    return "#{@links}"

  end

  def add_link name, vessel_name = @host.name

    @links = !@links ? "" : @links
    @links += "<link rel='stylesheet' type='text/css' href='public.#{vessel_name.downcase}/links/#{name}' />"

  end

  # Title

  def title q = nil

    return @title ? "<title>#{@title}</title>" : "<title>Missing title</title>"

  end

  # Footers

  def footers

    return "#{@footers}"

  end

  def add_footer html

    @footers = !@footers ? "" : @footers
    @footers += html

  end

  # Output

  def to_html

    return "
<!DOCTYPE html>
<html>
  <head>
    #{metas}
    #{scripts}
    #{links}
    #{title}
    <style>
      #{@style}
    </style>
  </head>
  <body>
    #{@body}
  </body>
  #{@footers}
</html>"

  end

end
