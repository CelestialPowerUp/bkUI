#!/bin/bash


#git stash
#git checkout feature_backend_ui &&
#git pull github_core  &&
echo $4 $1:$3
rsync -avc $4 --rsh="sshpass -p $2 ssh -o StrictHostKeyChecking=no -l root"  $1:$3
 
#git stash pop
