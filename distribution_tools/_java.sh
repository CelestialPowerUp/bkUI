#!/bin/bash

local_cfg="$1"
remote_ip="$3"
remote_name_ip="$2@$3"
remote_tomcat_path="$4"
remote_pwd="$5"
local_dir="$6"
remote_port="$7"
local_mvn_target="RestStack.Web/target"
local_war_name="reststack.web-1.0-SNAPSHOT.war"



echo_color()
{
echo -e "\033[47;41m $1 \033[0m";
}

echo_color "1. change to $local_dir " &&
cd $local_dir  &&

echo_color "2. mvn clean & package .." &&
mvn clean && mvn package  &&

cd $local_mvn_target  &&

echo_color "3. rm $local_mvn_target.." &&
rm -rf ROOT    &&

echo_color "4. unzip .." &&
unzip $local_war_name -d ROOT   &&

echo_color "5. cp files .." &&
cp -f  $YAC_CONFIG/$local_cfg/* ROOT/WEB-INF/classes/   &&

#stop tomcat
echo_color "6. shutdown remote tomcat .." &&
# sshpass -p $remote_pwd ssh -o StrictHostKeyChecking=no  $remote_name_ip "$remote_tomcat_path/bin/shutdown.sh"    &&

echo_color "7. rsync remote .. $remote_ip:$remote_tomcat_path/webapps" &&
rsync -avc --progress   ROOT --rsh="sshpass -p $remote_pwd ssh -p $remote_port -o StrictHostKeyChecking=no -l root"  $remote_ip:$remote_tomcat_path/webapps   &&

echo_color "8. startup remote tomecat .." &&
sshpass -p $remote_pwd ssh -p $remote_port -o StrictHostKeyChecking=no  $remote_name_ip "$remote_tomcat_path/bin/shutdown.sh && $remote_tomcat_path/bin/startup.sh"    && 

echo_color "successful!" &&
cd .. &&
echo_color "9. mvn clean .." &&

mvn clean 1>/dev/null  
 
