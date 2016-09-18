#!/bin/env ruby
# encoding: utf-8

module CorpseHttp

  def metas

    return "
<meta charset='UTF-8'>
<meta name='viewport'            content='width=device-width, initial-scale=1, maximum-scale=1'>
<meta name='apple-mobile-web-app-capable' content='yes' />
<meta name='viewport'        content='width=device-width, initial-scale=1.0'>
<meta name='description'         content='Works of Devine Lu Linvega' />
<meta name='keywords'            content='aliceffekt, traumae, ikaruga, devine lu linvega' />
<meta name='apple-mobile-web-app-capable' content='yes'>"

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
    @links += "<link rel='#{rel}' type='#{type}' href='links/#{name}' />"

  end

  # Title

  def title

    return "<title>#{@title}</title>"

  end

  def set_title name

    @title = name

  end

  # Title

  def body

    return "<body>#{@body}</body>"

  end

  def set_body body

    @body = body

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
</head>
#{body}
</html>"

  end

end