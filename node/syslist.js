var fs = require('fs');

var arr = process.argv[2].toString().split('=');
var file_path = arr[1];

var data = fs.readFileSync(file_path, 'utf8')

var os = require('os');
var usage = require('usage'); //설치x
var ps = require('ps-node'); //설치x
var exec = require('child_process').exec;

function getProcessesList(){
  for(let m in map){
    getStatus(m, map[m].cmd);
  }
}

getProcessesList();

function getStatus(nm, cmd){
  var param = {};
  ps.lookup({command:cmd}, function(err, resultList){
    var param = {};
    var process = resultList[0];
    if(process){
      param.pid = process.pid;
      param.cmd = process.command;
      param.status = resultList.length>1?'ALIVE('+resultList.length.toString()+')':'ALIVE';
      usage.lookup(process.pid, function(err, result){
        if(err){
          param.cpu = '-';
          param.mem = '-';
        } else {
          param.cpu = result.cpu;
          param.mem = result.memory;
        }
        exec("ps -p "+process.pid.toString()+" -o start -f | grep -v START | awk '{print $1}'", function(err, stdout, stderr){
          if(err) param.stime = '-';
          else param.stime = stdout;
          printProcesses(nm, param);
        });
      });
    } else {
      param.pid = '-';
      param.cmd = cmd;
      param.status = 'DEAD';
      param.cpu = '-';
      param.mem = '-';
      param.stime = '-';
      printProcesses(nm, param);
    }
  });
}

function printProcesses(cmd, p){
  console.log(cmd, p.pid, p.status, p.cpu, p.mem, p.stime);
}
