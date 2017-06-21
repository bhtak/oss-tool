var fs = require('fs');

var defaultConf = {
	"conf" : process.env.HOME + '/HOME/conf/proc.json',
};

/**
 *  check argument
 */
function checkArgv( argv, config)
{
	var options = config || defaultConf;
	for( var i=0; i< argv.length; i++) {
		if ( argv[i].substr(0,1) == '-') {
			var opt = argv[i].substr(1).split('=');
			if ( opt.length > 1) options[opt[0]] = opt[1];
			else if ( argv.length > i+1) options[opt[0]] = argv[i+1];
			else console.log( "parameter missing for option [-" + opt[0] + "]");
		}
	}

	return options;
}

function readConf( arg, callback) {
	fs.readFile( arg['conf'], (err, data) => {
		if (err) {
			console.log(err);
		}
		else {
			var json = '';
			var lines = data.toString().split('\n');
			for( var i=0; i <  lines.length; i++) {
				if ( lines[i].substr(0,1) != '#') json += lines[i];
			}
			callback( JSON.parse(json));
		}
	});
} 

exports.checkArgv = checkArgv;
exports.readConf = readConf;
