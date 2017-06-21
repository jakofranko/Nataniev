#!/bin/env ruby
# encoding: utf-8

require 'json'

class ActionList

  include Action

  def initialize q = nil

    super

    @name = "List"
    @docs = "Deliver the Oscean wiki."

  end

  def act q = nil

    q = q.gsub("-","/")
    a = []
    Dir["#{$nataniev.path}/#{q}/*"].each do |path|
      a.push(path.split("/").last)
    end
    return a.to_json

  end

end

class ActionLoad

  include Action

  def initialize q = nil

    super

    @name = "Load"
    @docs = "Deliver the Oscean wiki."

  end

  def act q = nil

    q = q.gsub("-","/")

    lines = []
    File.open($nataniev.path+q, "r") do |f|
      f.each_line do |line|
        lines.push(line)
      end
    end
    return {:lines => lines}.to_json

  end

end

class VesselEditor

  include Vessel

  def initialize id = 0

    super

    @name = "editor"
    @path = File.expand_path(File.join(File.dirname(__FILE__), "/"))
    @docs = "The Nataniev lobby."

    install(:lobby,:list)
    install(:lobby,:load)
    install(:generic,:document)
    install(:generic,:help)

  end

end