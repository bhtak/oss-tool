var exec = require('child_process').exec;
var fs = require('fs');
var util = require('util');
var sprintf = require('sprintf-js').sprintf;
var totalmem = require('os').totalmem();

function check_argv( argv, defaultConfig)
{
	var options = defaultConfig || {};
	for( var i=0; i< argv.length; i++) {
		if ( argv[i].substr(0,2) == '--') {
			var opt = argv[i].substr(2).split('=');
			options[opt[0]] = opt[1];
		}
	}

	return options;
}

var defaultConf = {
	"conf" : process.env.HOME + '/HOME/conf/proc.json'
};

var procConf = {};

var arg = check_argv( process.argv, defaultConf);
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
			procConf = JSON.parse(json);

			ps_list( function(err, proc) {
				if ( err) console.log(err);
				else filter(proc);
			});
		}
	});
 
function filter(proc) 
{
	const fmt = '%-8d %-20s  %2.1f  %2.1f  %s';
	console.log( sprintf( "%-8s %-20s %4s %4s  %-s", "PID", "Name", "CPU", "MEM", "Start"));

	for( var i=0; i< proc.length; i++) {
		if ( procConf['proc'].hasOwnProperty( proc[i].name)) {
			console.log( sprintf( fmt, proc[i].pid, proc[i].name, proc[i].cpu, proc[i].mem, proc[i].start));
		}
	}
}

function ps_list( callback) 
{
	exec("ps -A -o pid,rss,vsz,pcpu,comm,start_time,time,size", function( err, stdout, stderr) {
			if ( err) console.log( err);
			else {
				var proc = stdout.split("\n")
				.filter( function( line, index) {
					return line && index >=1;
					})
				.map( function(line) {
					var s = line.trim().split(/\s+/);

					return { pid : parseInt(s[0]),
						name : s[4],
						cpu : parseFloat(s[3]),
						mem : parseInt(s[7])*1024/totalmem,
						start: s[5]};
					});

				callback( null, proc);
			}
			});
}
