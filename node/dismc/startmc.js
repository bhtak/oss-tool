var exec = require('child_process').exec;
var sprintf = require('sprintf-js').sprintf;
var totalmem = require('os').totalmem();
var conf = require('./conf')

/*
 * -b <proc> : 해당 프로세스를 실행한다.
 */

var arg = conf.checkArgv( process.argv);

conf.readConf( arg, function(conf) {
	// conf : ~/HOME/conf/proc.json에서 읽은 설정 파일 
	//
	if ( arg.hasOwnProperty('b')) {
		if ( conf['proc'].hasOwnProperty( arg['b'])) {
			console.log( "Start process : " + arg['b']);
		}
		else {
			console.log( "Configuration not found for " + arg['b']);
		}
	}
	
});


