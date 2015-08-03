#!/bin/bash

dir=$1
fis_cfg_dir="fis-cfgs"

if [ -e $dir/$fis_cfg_dir ]; then
	echo dir aready exits
else
	mkdir $dir/$fis_cfg_dir
fi

enviroment_dir_name="enviroment"
str_enviroment=$(ls $dir/$enviroment_dir_name/ | sort)
arr_enviroment=(${str_enviroment// / })
enviroment_file_name="data.json"

str_platform=$(ls $dir/platform/ | sort)
arr_platform=(${str_platform// / })

for i in ${arr_enviroment[@]} 
do
    domain=$(jq '.domain' $dir/$enviroment_dir_name/$i/$enviroment_file_name)
    len=${#domain}
    for j in ${arr_platform[@]} 
	do
	    echo "fis.config.merge({ roadmap : { domain : "${domain:0:len-1}"/"$j"\" } });" > $dir/$fis_cfg_dir/"fis-"$i"-"$j"-conf.js"
	done
done
