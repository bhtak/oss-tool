var spawn = require('child_process').spawn;
var sprintf = require('sprintf-js').sprintf;
var totalmem = require('os').totalmem();
var conf = require('./conf')
var ps_list = require('./ps_list').ps_list;

/*
 * -b <proc> : 해당 프로세스를 실행한다.
 */

var arg = conf.checkArgv( process.argv);

conf.readConf( arg, function(conf) {
	// conf : ~/HOME/conf/proc.json에서 읽은 설정 파일 
	//
	if ( arg.hasOwnProperty('b')) {
		var name = arg['b'];
		if ( conf['proc'].hasOwnProperty( name) && conf['proc'][name].hasOwnProperty('start')) {
			var cmd = conf['proc'][name]['start'];
			if ( cmd.substr(0,1) == "~") cmd = process.env.HOME + cmd.substr(1);

			ps_list( conf, function( err, list) {
				if ( list[name].length > 0) {
					console.log("Process '%s' already running.", name);
					process.exit(1);
				}

				console.log( cmd);
			});
		}
		else {
			console.log( "Error: Configuration not found for " + arg['b']);
			process.exit(1);
		}
	}
	
});


