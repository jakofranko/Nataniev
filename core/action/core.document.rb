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

    folders  = get_folders
    @oscean  = $nataniev.make_anonym("oscean")
    @lexicon = Memory_Hash.new("lexicon",@oscean.path)

    folders.each do |folder|
      repo = get_repo_with_name(folder.split("/").last)
    end

    return "??"

  end

  def get_folders

    a = []
    Dir["#{$nataniev.path}/core/*/*/"].each do |folder_path|
      folder_parts = folder_path.split("/")
      type = folder_parts[folder_parts.length-2]
      if !folder_parts.last.include?(type+".") then next end
      a.push(folder_path)
    end
    return a

  end

  def get_repo_with_name name

    p name

  end

end