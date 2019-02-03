#!/bin/env ruby
# encoding: utf-8

class ActionHelp

    include Action

    def initialize q = nil

        super

        @name = "Help"
        @docs = "List available commands."

    end

    def act q = nil

        t = "#{host.docs}\n"

        host.actions.each do |category, actions|
            t += "#{category.capitalize}\n"
            actions.each do |action|
                t += "#{action.name.append(' ', 14)} | #{action.docs}\n"
            end
        end

        return t

    end

end
