var fs = require('fs');
var path = require('path');
var parser = require('./parser');
var taskUtil = require('./taskUtil');
var exec = require('child_process').exec;

var threads = 3;
var index = 0;

function runTasks(tasks){
    var children = [];

    var execTask = function(task){
        console.log(task);
        if(task.curlFilePath !== task.workingCurlPath){
            fs.renameSync(task.curlFilePath, task.workingCurlPath);
        }

        var cmd = 'curl --fail --create-dirs -K ' + task.workingCurlPath;
        console.log(cmd);
        var child = exec(cmd, function callback(error, stdout, stderr) {
//        console.log(error);
//        console.log(stdout);
//        console.log(stderr);
            var success = function(parsedText){
                fs.writeFileSync(task.parsedPath, parsedText);
                fs.renameSync(task.workingCurlPath, task.successCurlPath);
            };
            var fail = function(parsedText){
                fs.renameSync(task.workingCurlPath, task.errorCurlPath);
            };
            parser.parseFile(task.htmlPath, success, fail);

            // delete child process
            for(var i = 0; i < children.length; i++){
                if(children[i] === child){
                    console.log('found');
                    children.splice(i, 1);
                    break;
                }
            }

            // exec new child process or exit
            if(children.length < threads){
                if(index === tasks.length){
                    console.log('exit');
                    return 0;
                }
                console.log('exec ' + index);
                execTask(tasks[index]);
            }
        });

        index++;
        children.push(child);
        console.log('children: ' + children.length);
        console.log('index: ' + index);
    };

    while(index < threads && index < tasks.length){
        console.log('----------------', tasks[index]);
        execTask(tasks[index]);
    }
}

function main(){
    var allTasks = taskUtil.loadAllTasks();
//    console.log(allTasks);
    if(allTasks.length === 0){
        console.log('No curl config file found');
        return 0;
    }

    runTasks(allTasks);
}

main();


