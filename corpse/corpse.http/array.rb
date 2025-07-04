#!/bin/env ruby

# For rendering memories to HTML
class Array

  def runes_collection

    {
      '&' => { tag: 'p' },
      '-' => { tag: 'list', stash: true },
      '#' => { tag: 'code', stash: true },
      '?' => { tag: 'note' },
      '*' => { tag: 'h2' },
      '=' => { tag: 'h3' },
      '+' => { tag: 'hs' },
      '|' => { tag: 'tr', sub: 'td', rep: true },
      '»' => { tag: 'tr', sub: 'th', rep: true },
      '>' => { tag: '' }
    }

  end

  def runes(cat = 'generic')

    html = ''
    prev = ''
    collection = runes_collection
    stash = ''
    tag = ''

    each do |line|

      rune = line[0, 1]
      text = line.sub(rune, '').strip
      tag  = collection[rune] ? collection[rune][:tag] : 'unknown'
      sub_tag  = collection[rune] ? collection[rune][:sub] : 'unknown'

      if rune == '%' then html += Media.new(cat, text.split(' ').first, text.split(' ')[1, 3].join(' ')).to_s
                          next end
      if rune == '$' then html += $nataniev.answer(text)
                          next end
      if rune == '@' then html += query(text)
                          next end

      if stash != '' && rune != prev
        prev_tag = collection[prev][:tag]
        html += "<#{prev_tag}>#{stash}</#{prev_tag}>"
        stash = ''
      end

      if collection[rune] && collection[rune][:stash]
        stash += "<ln>#{text}</ln>"
      elsif collection[rune] && collection[rune][:rep]
        rep = ''
        text.split('|').each do |seg|

          html += "<#{sub_tag}>#{seg}</#{sub_tag}>"

        end
        html += "<#{tag}>#{rep}</#{tag}>"
      elsif tag == ''
        html += "#{text}"
      else
        html += "<#{tag}>#{text}</#{tag}>"
      end

      prev = rune

    end

    if stash != ''
      html += "<#{tag}>#{stash}</#{tag}>"
      stash = ''
    end

    html.markup

  end

  def query(text)

    @path = "#{$nataniev.path}/vessel/vessel.oscean"

    memory_name = text.split(' ').first.downcase.gsub(' ', '.')
    memory_target = text.sub(memory_name, '').strip
    memory = Memory_Hash.new(memory_name, @path).to_h

    return memory[memory_target.upcase].runes if memory[memory_target.upcase]

    "<p>Could not locate #{memory_target} entry in #{memory_name}.</p>"

  end

end
