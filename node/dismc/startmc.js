var spawn = require('child_process').spawn;
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
		var name = arg['b'];
		if ( conf['proc'].hasOwnProperty( name)) {
			var cmd = conf['proc'][name][0];
			if ( cmd.substr(0,1) == "~") cmd = process.env.HOME + cmd.substr(1);

			console.log( cmd);
		}
		else {
			console.log( "Error: Configuration not found for " + arg['b']);
		}
	}
	
});


