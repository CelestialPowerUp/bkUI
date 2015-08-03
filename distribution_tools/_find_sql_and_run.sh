#!/bin/bash

localcfg=$1
dir=$2
cfgfile=$localcfg".cfg"

mysql_ip=$3
mysql_user_name=$4
mysql_pwd=$5
mysql_db_name=$6

str=$(ls $dir | sort)
arr=(${str// / })
#echo ${arr[@]} 
for i in ${arr[@]} 
do
    if [ -e $dir$i ]; then
    	if [ -d $dir$i ]; then
    		echo now $dir$i
    		if [ -e $dir$i/$cfgfile ]; then
    			areadydone=$(cat $dir$i/$cfgfile)
				echo $areadydone
			else
				areadydone="areadydone"
				echo $dir$i/$cfgfile file not exits
			fi

			innerstr=$(ls $dir$i | grep ".sql$" |sort)
			innerarr=(${innerstr// / })
			#echo ${innerarr[@]}
			for j in ${innerarr[@]} 
			do
			    if [ -e $dir$i/$j ]; then
			    	if [ -f $dir$i/$j ]; then
			    		if [[ $areadydone =~ .*$j.* ]]; then
			    			echo $dir$i/$j file areadydone
			    		else
			    			bash _sql.sh $mysql_ip $mysql_user_name $mysql_pwd $mysql_db_name $dir$i/$j
			    			areadydone=$areadydone" "$j
			    		fi
			    	fi
			    fi
			done
			#echo $areadydone > $dir$i/$cfgfile
    	fi
    fi
done

#move scripts
mv $dir* $dir../sql_history/
