#!/bin/bash
cd /Users/VillaMoirai/Github/Nataniev
ls
{
  sleep 2
  open http://localhost:8888/
}&    
ruby nataniev.server.rb lobby
