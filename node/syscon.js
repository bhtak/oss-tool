var arr = process.arg[2].toString().split('=');
var file_path = arr[1];

console.log(file_path);
process.exit(0);

var map = require(proce);
var ps = require('ps-node');
var spawn = require('child_process').spawn;

var cmd = process.argv[3];
var proc = null;

if ( !(cmd == 'startmc' || cmd == 'stopmc') ) {
  console.log('Usage : startmc|stopmc [option] [process|group]');
  process.exit(0);
}

var cnt = 0;
var cmp = 0;
var option = (function(arg){
  if(arg.substr(0,1) == '-'){
    var opt = arg.substr(1);
    proc = process.argv[5].toString();
    if(opt == 'b') control(map[proc]);
    else if(opt == 'g'){
      for(let m in map){
        if(map[m].group == proc){
          control(map[m]);
        }
      }
    }
  } else if (arg == 'all'){
    for(let m in map){
      control(map[m]);
    }
  }
  if(cmd == 'startmc'){
    setInterval(function(){
      if(cnt == cmp){
        process.kill(process.pid);
      };
    },2000);
  }
})(process.argv[4].toString());



function control(_proc){
  ps.lookup({
    command : _proc.cmd
  },function(err, resultList){
    if(err){ console.error('Error');}
    else if(resultList.length > 0){
      if(cmd == 'stopmc'){
        for( var i = 0; i < resultList.length ; i ++){
          (function(res){
            ps.kill(res.pid, 'SIGKILL', function(err){
              if(err){ console.error('process kill\nPID : %s\nCMD : %s\nResult : Success',res.pid, res.command);}
              else console.log('process kill\nPID : %s\nCMD : %s\nResult : Success',res.pid, res.command);
            });
          })(resultList[i]);
        }
      }
    } else if (cmd == 'startmc'){
      cnt ++ ;
      var child = spawn(_proc.exec, [], {
        detached : true,
        stdio : ['ignore']
      });
      child.unref();
      cmp++;
    }
  });
}
