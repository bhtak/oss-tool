var spawn = require('child_process').spawn;
var sprintf = require('sprintf-js').sprintf;
var totalmem = require('os').totalmem();
var conf = require('./conf')

/*
 * -b <proc> : 해당 프로세스를 종료한다.
 * -a : 모든 프로세스를 종료한다.
 */

var arg = conf.checkArgv( process.argv);

conf.readConf( arg, function(conf) {
	// conf : ~/HOME/conf/proc.json에서 읽은 설정 파일 
	//
	if ( arg.hasOwnProperty('b')) {
		stopProc( conf, arg['b']);
	}
	
});

function stopProc( conf, name) 
{
	if ( typeof name === 'undefined') {
		console.log( "Error: Process not found");
	}
	else {
		if ( conf['proc'].hasOwnProperty( name) && conf['proc'][name].hasOwnProperty('stop')) {
			var cmd = conf['proc'][name]['stop'];
			if ( cmd.substr(0,1) == "~") cmd = process.env.HOME + cmd.substr(1);
			else if ( cmd == 'kill_pid') cmd += sprintf( " %s", conf['proc'][name]['pattern']);

			console.log( "\n" + cmd);
		}
		else {
			console.log( "Error: Configuration not found for " + name);
		}
	}
}
