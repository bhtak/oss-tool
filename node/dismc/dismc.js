var exec = require('child_process').exec;
var sprintf = require('sprintf-js').sprintf;
var totalmem = require('os').totalmem();
var conf = require('./conf')

var arg = conf.checkArgv( process.argv);

conf.readConf( arg, function(conf) {
	// conf : ~/HOME/conf/proc.json에서 읽은 설정 파일 
	// read configuration and check process status
	
	ps_list( function(err, proc) {
		if ( err) console.log(err);
		else filter(conf, proc);
	});
});

function match( conf, proc) 
{
	for( var m in conf) {
		if ( conf[m].hasOwnProperty( 'pattern') && conf[m].hasOwnProperty( 'user')) {
			// use the regex pattern
			var pattern = new RegExp( conf[m]['pattern']);
			if ( proc.user.includes(conf[m]['user']) && pattern.test(proc.cmd)) {
				//console.log("PATH:", pattern, proc.cmd);
				return m;
			}
		}
	}
	return false;
}

function filter(conf, proc) 
{
	const fmt = '%-8d %-8s %-20s  %3.1f  %3.1f  %s';
	console.log( sprintf( "%-8s %-8s %-20s %4s  %4s  %-s", "PID", "User", "Name", "CPU", "MEM", "Start"));

	var info = {};

	for( var i=0; i< proc.length; i++) {
		var procName = match( conf['proc'], proc[i]);
		if ( procName !== false) info[procName] = proc[i];
	}
	
	var alive = 0, dead = 0;

	for( var m in conf['proc']) {
		if ( info.hasOwnProperty( m)) {
			var proc = info[m];
			console.log( sprintf( fmt, proc.pid, proc.user, m, proc.cpu, proc.mem, proc.start));
			alive ++;
		}
		else {
			console.log( sprintf( "%-8s %-8s %-20s", "-", "-", m));
			dead ++;
		}
	}
	console.log( sprintf( "\nAlive:%d Dead:%d", alive, dead));
}

function ps_list( callback) 
{
	exec("ps -A -o pid,user,vsz,pcpu,comm,start_time,size,cmd", function( err, stdout, stderr) {
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
						user : s[1],
						cpu : parseFloat(s[3]),
						mem : parseInt(s[6])*1024/totalmem,
						start: s[5], 
						cmd : s.slice(7).join(" ")};
					});

				callback( null, proc);
			}
			});
}
