#!/bin/env ruby
# encoding: utf-8

class ActionDocument

  include Action

  def initialize q = nil

    super

    @name = "Document"
    @docs = "[TODO]"

  end

  def act q = nil
    
    return "
name: #{@host.name}
docs: #{@host.docs}
path: #{@host.path}
date: #{Desamber.new}
text:
link:
logo:

"

  end

end