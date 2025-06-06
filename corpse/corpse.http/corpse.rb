#!/bin/env ruby
require_relative 'media'
require_relative 'string'
require_relative 'array'
require_relative 'progress'

# For serving vessels
class CorpseHttp

  include Corpse

  attr_accessor :body, :style

  attr_writer :metas, :scripts, :footer_scripts, :links, :footers

  def initialize(host = nil)

    @host = host
    @body = ''
    @footers = ''
    @style = ''

  end

  # Metas

  def metas

    "<meta charset='UTF-8'>#{@metas}"

  end

  def add_meta(name, content)

    @metas = !@metas ? '' : @metas
    @metas += "<meta name='#{name}' content='#{content}' />"

  end

  # Scripts

  def scripts

    @scripts.to_s

  end

  def add_script(name, vessel_name = @host.name)

    @scripts = !@scripts ? '' : @scripts
    @scripts += "<script src='public.#{vessel_name.downcase}/scripts/#{name}'></script>"

  end

  def footer_scripts

    @footer_scripts.to_s

  end

  def add_footer_script(name, vessel_name = @host.name)

    @footer_scripts = !@footer_scripts ? '' : @footer_scripts
    @footer_scripts += "<script src='public.#{vessel_name.downcase}/scripts/#{name}'></script>"

  end

  # Links

  def links

    @links.to_s

  end

  def add_link(name, vessel_name = @host.name)

    @links = !@links ? '' : @links
    @links += "<link rel='stylesheet' type='text/css' href='public.#{vessel_name.downcase}/links/#{name}' />"

  end

  # Title

  def title

    @title ? "<title>#{@title}</title>" : '<title>Missing title</title>'

  end

  # Footers

  def footers

    @footers.to_s

  end

  def add_footer(html)

    @footers = !@footers ? '' : @footers
    @footers += html

  end

  # Output

  def to_html

    "
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
