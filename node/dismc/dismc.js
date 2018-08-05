var exec = require('child_process').exec;
var sprintf = require('sprintf-js').sprintf;
var totalmem = require('os').totalmem();
var conf = require('./conf');
var ps_list = require('./ps_list').ps_list;

var arg = conf.checkArgv( process.argv);

conf.readConf( arg, function(conf) {
	// conf : ~/HOME/conf/proc.json에서 읽은 설정 파일 
	// read configuration and check process status
	
	// -b option을 사용한 경우 
	if ( arg.hasOwnProperty('b') && typeof conf.proc[ arg.b] === 'undefined') {
		console.log('Undefined process:', arg.b);
		process.exit(1);
	}

	ps_list( conf, function(err, proc) {
		if ( err) console.log(err);
		else display( proc);
	});
});

function display( info) 
{
		// set format
	const fmt = '%-8d %-8s %-20s  %2.1f  %2.1f  %s';

	var alive = 0, dead = 0;

	if ( arg.hasOwnProperty('b')) {
		if ( info.hasOwnProperty( arg.b) && info[arg.b].length > 0) {
			console.log("ALIVE:%d", info[arg.b].length);
			process.exit(0);
		}
		else {
			console.log("DEAD");
			process.exit(1);
		}

		return;
	}
	else if ( arg.hasOwnProperty('l')) {
		Object.keys(info).forEach( (proc) => console.log(proc));
		return ;
	}

	if( !arg.hasOwnProperty('t') ) console.log( sprintf( "%-8s %-8s %-20s %5s %4s  %-s", "PID", "User", "Name", "CPU", "MEM", "Start"));

	for( var m in info) {
		if ( info[m].length > 0) {
			var proc = info[m];
			if( arg.hasOwnProperty('t') ) {
				var mem = 0.0;
				var cpu = 0.0;
				proc.forEach( function(p) {
						mem += p.mem;
						cpu += p.cpu;
				});
				console.log(sprintf("%s:%d:%2.1f:%2.5f", m, proc.length, cpu,mem));
			}
			else	{
				// print all process instance
				proc.forEach( function(p) {
					console.log( sprintf( fmt, p.pid, p.user, m, p.cpu, p.mem, p.start));
				});
			}
			alive += proc.length;
		}
		else {
			if( arg.hasOwnProperty('t') )  console.log("%s:0",m);
			else console.log( sprintf( "%-8s %-8s %-20s", "-", "-", m));
			dead ++;
		}
	}
	if( arg.hasOwnProperty('t') ) console.log("Alive=%d,Total=%d", alive, alive+dead);
	else console.log( sprintf( "\n%s Alive:%d Dead:%d", new Date(), alive, dead));
}

