#!/bin/bash
# 这玩意是travis-ci通知企业微信机器人用的
 
if [ ! -n "$1" ] ;then
	echo "you have not input any word!"
elif [ $1 -eq 0 ];then
	curl -X POST -H 'Content-type: application/json' --data '{"msgtype":"markdown","markdown":{"content":"builder-webpack4测试失败，[查看状态](https://travis-ci.com/feflow/builder-webpack4)"}}' https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=$robot_key
elif [ $1 -eq 1 ];then
	curl -X POST -H 'Content-type: application/json' --data '{"msgtype":"markdown","markdown":{"content":"builder-webpack4测试成功，[查看状态](https://travis-ci.com/feflow/builder-webpack4)"}}' https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=$robot_key
