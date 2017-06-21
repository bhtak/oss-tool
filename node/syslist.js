var os = require('os');
var usage = require('usage');
var ps = require('/usr/local/bin/node_modules/ps-node');
var exec = require('child_process').exec;
var map = require('./mapping.js')

function* getProcessesList(){
  var s = null;
  for(let m in map){
    s = yield getStatus(map[m].cmd);
  }
  return s;
}

var iterator = getProcessesList();

function getStatus(cmd){
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
          printProcesses(param);
        });
      });
    } else {
      param.pid = '-';
      param.cmd = cmd;
      param.status = 'DEAD';
      param.usage.cpu = '-';
      param.usage.mem = '-';
      param.stime = '-';
      printProcesses(param);
    }
  });
}

function printProcesses(p){
  console.log(p);
  iterator.next();
}
