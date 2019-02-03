#!/bin/env ruby
# encoding: utf-8

class ActionDocument

  include Action

  def initialize q = nil

    super

    @name = "Document"
    @docs = "Generate the GitHub documentation file."

  end

  def act q = nil

    content_actions = ""

    @host.actions.each do |cat,a|
      content_actions += "#{cat.capitalize}\n"
      a.each do |action|
        content_actions += "  #{action.name.append(' ',14)} | #{action.docs}\n"
      end
    end

    content = "# #{@host.name}

#{@host.docs}

## Available actions

```
#{content_actions}```

## Documentation

Generated with [Nataniev](http://wiki.xxiivv.com/Nataniev) on **#{Desamber.new}**, view the [project site](#{@host.site}).

## License

See the [LICENSE](https://github.com/jakofranko/vessel.#{@host.name.downcase}/LICENSE) file for license rights and limitations (CC)."

    # Create temp file
    out_file = File.new("#{@host.path}/README.md.tmp", "w")
    out_file.puts(content)
    out_file.close

    # Replace file
    File.rename("#{@host.path}/README.md.tmp", "#{@host.path}/README.md")

    return "\n===========================\n\n#{content}\n\n===========================\n\n"

  end

end
