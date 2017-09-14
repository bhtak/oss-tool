#!/bin/bash

ENDSTATE=$3
NAME=$2
TYPE=$1
LOG=/var/log/keepalived.log
HOST=$(hostname)
MASTER_HOSTFILE=/data/keepalived/host.lock

function start_proc() 
{
	echo `date` "start $1" >> $LOG
	service $1 start
}

function stop_proc() 
{
	service $1 stop
	echo `date` "stop $1" >> $LOG
}

function check_for_start()
{
	while true;
	do
	  FILE_CONTENT=$(cat $MASTER_HOSTFILE)
	  if [[ ("$HOST" == "$FILE_CONTENT") || ( "END" == "${FILE_CONTENT:0:3}") ]]
	  then
		break;
	  fi

	  echo `date` "waiting until stop." >> $LOG
	  sleep 1;
	done	
}

function start_processes() 
{
	echo `date` "New Master::" `cat $MASTER_HOSTFILE` >> $LOG
	check_for_start

	start_proc mysqld
	start_proc influxd
	start_proc grafana-server
	start_proc mqmon
	start_proc tremon
	/etc/keepalived/ps_list.sh >> $LOG
	echo `hostname` > $MASTER_HOSTFILE
}

function stop_processes() 
{			
	if [ "$HOST" == $(cat $MASTER_HOSTFILE) ]; then
		echo "START${HOST}" > $MASTER_HOSTFILE
		stop_proc mysqld
		stop_proc influxd
		stop_proc grafana-server
		stop_proc mqmon
		stop_proc tremon
		/etc/keepalived/ps_list.sh >> $LOG
		echo "END${HOST}" > $MASTER_HOSTFILE
	fi
}

#clean file
echo "-------------------------------------------------------------" >> $LOG
echo `date` "[$TYPE. $NAME] State changed to $ENDSTATE" >> $LOG
echo "-------------------------------------------------------------" >> $LOG

case $ENDSTATE in
    "BACKUP") # Perform action for transition to BACKUP state
		stop_processes
              exit 0
              ;;
    "FAULT")  # Perform action for transition to FAULT state
		stop_processes
              exit 0
              ;;
    "MASTER") # Perform action for transition to MASTER state
		start_processes
              exit 0
              ;;
    *)        echo "Unknown state ${ENDSTATE} for VRRP ${TYPE} ${NAME}"
              exit 1
              ;;
esac

