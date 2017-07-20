#!/bin/bash
cd /Users/VillaMoirai/Github/Nataniev
ls
{
  sleep 2
  open http://localhost:8668/
}&    
ruby nataniev.server.rb lobby
