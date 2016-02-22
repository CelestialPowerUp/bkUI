#!/bin/bash

#copy .json configs to webapp and activities

echo $1-\>$3
echo $2-\>$3

cp -a $1/* $3 &&
cp -a $2/* $3

str=$(ls $3/activities/ | sort)
arr=(${str// / })

for i in ${arr[@]} 
do
    if [ -e $3/activities/$i ]; then
    	if [ -d $3/activities/$i ]; then
    		echo now $3/activities/$i
    		cp -a $1/* $3/activities/$i &&
			cp -a $2/* $3/activities/$i
    	fi
    fi
done
