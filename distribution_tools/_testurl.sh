#!/bin/bash


echo_color()
{
echo -e "\033[47;41m $1 \033[0m";
}

server_ok=false;
retry_delay=1;
while [[ $server_ok == false ]]; do

curl $1 > server.json

if [ $? == 0 ];then 
	jq .code server.json
	if [ $? == 0 ];then 
		echo_color "$1 返回json无误"
		server_ok=true;
	else
	cat server.json
	sleep $retry_delay;
	let retry_delay++;
	fi
else
	cat server.json;
	echo_color "$1 服务器异常，请检查！！";
	echo_color "$retry_delay 秒后重新测试！"
	sleep $retry_delay;
	let retry_delay++;
fi
done


