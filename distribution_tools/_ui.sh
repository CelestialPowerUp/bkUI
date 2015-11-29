#!/bin/bash


#git stash
#git checkout feature_backend_ui &&
#git pull github_core  &&
$ssh_shortcut=production
# rsync -avc $4 --rsh="sshpass -p $2 ssh -o StrictHostKeyChecking=no -l root"  $1:$3
rsync -avc --progress  $1  $ssh_shortcut:$2 

#git stash pop
