var fs = require('fs');
var parser = require('./parser');
var taskUtil = require('./taskUtil');
var exec = require('child_process').exec;

var arg = parseInt(process.argv[2]);
var maxConn = arg || 3; // 3 connections by default
var index = 0;

function runTasks(tasks){
    var children = [];

    var execTask = function(task){
        console.log(task);
        if(task.curlFilePath !== task.workingCurlPath){
            fs.renameSync(task.curlFilePath, task.workingCurlPath);
        }

        var cmd = 'curl --fail --create-dirs -K ' + task.workingCurlPath;
        var child = exec(cmd, function callback(error, stdout, stderr) {
            var html = fs.readFileSync(task.htmlPath, 'utf-8');
            var parsed = parser.parse(html);
            if(parsed === -1){
                fs.renameSync(task.workingCurlPath, task.errorCurlPath);
            }
            else{
                fs.writeFileSync(task.parsedPath, parsed);
                fs.renameSync(task.workingCurlPath, task.successCurlPath);
            }

            // delete child process
            for(var i = 0; i < children.length; i++){
                if(children[i] === child){
                    children.splice(i, 1);
                    break;
                }
            }

            // exec new child process or exit
            if(children.length < maxConn){
                if(index === tasks.length){
                    console.log('normal exit');
                    return 0;
                }
                console.log('exec ' + index);
                execTask(tasks[index]);
            }
        });

        index++;
        children.push(child);
        console.log('index: ' + index + ', children count: ' + children.length);
    };

    while(index < maxConn && index < tasks.length){
        execTask(tasks[index]);
    }
}

function main(){
    var allTasks = taskUtil.loadAllTasks();
    if(allTasks.length === 0){
        console.log('No curl config file found');
        return 0;
    }
    runTasks(allTasks);
}

main();