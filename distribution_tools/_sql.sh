#!/bin/bash
mysql_ip="$1"
mysql_user_name="$2"
mysql_pwd="$3"
mysql_db_name="$4"
sql_path="$5"

#mysql -h 120.132.59.94 -u ycar_db --password=$PRO_SQL_PWD  -P 4040 -D ycarapi  <./ycar_api_2/sql/ddl.sql > output.log
mysql -h $mysql_ip -u $mysql_user_name --password=$mysql_pwd  -P 4040 -D $mysql_db_name  < $sql_path >> $sql_path"_output.log"
