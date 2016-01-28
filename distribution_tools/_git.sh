#!/bin/bash

local_cfg="$1"
git add *.cfg 
git add *output.log
git commit -am "$local_cfg  auto committed by _git.sh" 
#old_commit_id=$(git show ${local_cfg} |head -n 1 |awk '{print $2}')     


