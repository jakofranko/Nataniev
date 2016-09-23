#!/bin/env ruby
# encoding: utf-8

module CorpseHttp

  include Corpse

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

  def set_style style_array

    @style = style_array

  end

  def style

    return "<style>#{@style}</style>"

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