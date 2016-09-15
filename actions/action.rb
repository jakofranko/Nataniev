#!/bin/env ruby
# encoding: utf-8

module Action

  private

  def find_present_vessel name

    name = " #{name} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").last.to_s.strip

    @actor.present_vessels.each do |v|
      if v.name.like(name) then return v end
    end

    return nil

  end

  def find_visible_vessel name

    name = " #{name} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").last.to_s.strip

    @actor.visible_vessels.each do |v|
      if v.name.like(name) then return v end
    end

    return nil

  end

  def find_inventory_vessel name

    name = " #{name} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").last.to_s.strip

    @actor.inventory_vessels.each do |v|
      if v.name.like(name) then return v end
    end

    return nil

  end

  def find_any_vessel name

    name = " #{name} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").last.to_s.strip

    id = -1
    $nataniev.parade.to_a.each do |v|
      id += 1
      v = $nataniev.make_vessel(id)
      if v.name.like(name) then return v end
    end

    return nil

  end

  def find_owned_vessel name

    name = " #{name} ".sub(" a ","").sub(" an ","").sub(" the ","").strip.split(" ").last.to_s.strip

    collection = []

    @actor.owned_vessels.each do |v|
      if v.name.like(name) then return v end
    end

    return collection

  end

end

module ActionCollection

  def initialize actor

    @actor = actor

  end

  def available
    
    return methods - Object.methods

  end

end