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
  attr_accessor :links
  attr_accessor :scripts
  attr_accessor :footer_scripts
  attr_accessor :footers
  attr_accessor :body
  attr_accessor :style

  def initialize host = nil

    @host = host
    @body  = ""
    @footers = ""
    @style = ""

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

  def add_script name, vessel_name = @host.name

    @scripts = !@scripts ? "" : @scripts
    @scripts += "<script src='public.#{vessel_name.downcase}/scripts/#{name}'></script>"

  end

  def footer_scripts

    return "#{@footer_scripts}"
    
  end

  def add_footer_script name, vessel_name = @host.name

    @footer_scripts = !@footer_scripts ? "" : @footer_scripts
    @footer_scripts += "<script src='public.#{vessel_name.downcase}/scripts/#{name}'></script>"

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
    #{body}
    #{footer_scripts}
  </body>
  #{@footers}
</html>"

  end

end
