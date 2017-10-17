var exec = require('child_process').exec;
var sprintf = require('sprintf-js').sprintf;
var totalmem = require('os').totalmem();

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
	var info = {};

	// init list
	var keys = Object.keys(conf.proc);
	for( var i=0; i< keys.length; i++) {
		info[ keys[i]] = [];
	}

	for( var i=0; i< proc.length; i++) {
		var procName = match( conf['proc'], proc[i]);
		if ( procName !== false) {
			// 이미 존재하는 경우 array push
			info[procName].push( proc[i]);
		}
	}

	return info;
}

function ps_list( conf, callback) 
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

					var start = s[5].indexOf('home') > 0 ? s[6] : s[5] ;
					return { pid : parseInt(s[0]),
						name : s[4],
						user : s[1],
						cpu : parseFloat(s[3]),
						mem : parseInt(s[6])*1024/totalmem,
						start: start, 
						cmd : s.slice(7).join(" ")};
					});

				if ( typeof callback === 'function') {
					callback( null, filter( conf, proc));
				}
			}
			});
}

exports.ps_list = ps_list;
