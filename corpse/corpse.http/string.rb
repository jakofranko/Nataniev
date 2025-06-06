#!/bin/env ruby

# For rendering Nataniev strings
class String

  def markup

    content = self

    return '' unless content

    search = content.scan(/(?:\{\{)([\w\W]*?)(?=\}\})/)

    # TODO: this may be broken? Why aren't details being used?
    search.each do |str, _details|

      content = content.gsub("{{#{str}}}", parser(str))

    end
    content = content.gsub('{_', '<i>').gsub('_}', '</i>')
    content = content.gsub('{*', '<b>').gsub('*}', '</b>')
    content = content.gsub('{#', '<c>').gsub('#}', '</c>')

    content.to_s

  end

  def parser(macro)

    return $nataniev.answer(macro[1, macro.length - 1].strip) if macro[0, 1] == '$'
    return Media.new(macro.split[1], macro.split[2], macro.split[3]).to_s if macro[0, 1] == '%'
    return "<a href='/Desamber'>#{Desamber.new.clock}</a>" if macro == '!clock'
    return "<a href='/Desamber'>#{Desamber.new}</a>" if macro == '!desamber'
    return "<a href='/Desamber'>#{Desamber.new(macro)}</a>" if macro[4, 1] == '-' && macro[7, 1] == '-'

    if macro.include?('|')
      ms = macro.split('|')

      return "<a href='#{ms[1]}' class='external'>#{ms('|')[0]}</a>" if ms[1].include?('http')

      return "<a href='#{ms[1]}'>#{ms[0]}</a>"
    end

    "<a href='/#{macro.gsub(' ', '+')}'>#{macro}</a>"

  end

  def has_badword

    %w[dick pussy asshole nigger cock jizz faggot nazi cunt sucker bitch fag jew nigga anus
       fuck].each do |bad_word|

      return bad_word if include?(bad_word)

    end
    nil

  end

  def is_alphabetic

    return true if gsub(/[^a-z]/i, '').downcase == downcase

    nil

  end

  def to_url

    downcase.gsub(' ', '+')
  end

end
