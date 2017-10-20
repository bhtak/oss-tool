#!/bin/bash

LOG=/var/log/keepalived.log
MASTER_HOSTFILE=/data/keepalived/host.lock
FILE_CONTENT=`cat $MASTER_HOSTFILE`

if [ "$HOSTNAME" == "$FILE_CONTENT" ]; then
	COUNT=$(/bin/ps ax | grep -E 'grafana-server|influxdb|mysqld' | grep -v grep | grep -v tail | wc -l)

	if [ $COUNT -ge 4 ]
	then
	  echo `date` "all processes is running in $HOSTNAME" >> $LOG
	  exit 0;
	else
	  echo `date` "not running in $HOSTNAME" >> $LOG
	  exit 1;
	fi
elif [[ ("END${HOSTNAME}" == "$FILE_CONTENT") || ("START${HOSTNAME}" == "$FILE_CONTENT") ]]; then
	echo `date` "In transition" >> $LOG
	exit 1
else
	echo `date` "$HOSTNAME is not master. return 0 in $0" >> $LOG
	exit 0;
fi

