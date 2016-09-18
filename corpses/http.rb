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

  def add_script_jquery

    @scripts.to_s += "<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js' ></script>"

  end

  def add_script name

    @script.to_s += "<script src='scripts/#{name}'></script>"

  end

  # Links

  def links

    return "
<link rel='shortcut icon'      href='http://wiki.xxiivv.com/img/interface/favicon.ico' />
<link rel='apple-touch-icon-precomposed'   href='../../img/interface/phone_xxiivv.png'/>
<link rel='shortcut icon' href='http://wiki.xxiivv.com/img/interface/favicon.ico' />"

    return "#{@links}"

  end

  def add_link rel = 'stylesheet', type = 'text/css', name

    @links.to_s += "<link rel='#{rel}' type='#{type}' href='links/#{name}' />"

  end

  # Title

  def title

    return "<title>#{@title}</title>"

  end

  def set_title name

    @title = name

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
<body>
  #{body}
</body>
</html>"

  end

end