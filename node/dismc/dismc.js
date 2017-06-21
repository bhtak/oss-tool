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

function filter(conf, proc) 
{
	const fmt = '%-8d %-20s  %2.1f  %2.1f  %s';
	console.log( sprintf( "%-8s %-20s %4s %4s  %-s", "PID", "Name", "CPU", "MEM", "Start"));

	for( var i=0; i< proc.length; i++) {
		if ( conf['proc'].hasOwnProperty( proc[i].name)) {
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
