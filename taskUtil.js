var fs = require('fs');
var path = require('path');

function Task(id, curlFilePath){
    this.id = id;
    this.curlFilePath = curlFilePath;
    this.createTime = new Date;

    this.originCurlPath = path.join('origin', id + '.curl');
    this.workingCurlPath = path.join('working', id + '.curl');
    this.successCurlPath = path.join('success', id + '.curl');
    this.errorCurlPath = path.join('error', id + '.curl');
    this.htmlPath = path.join('html', id + '.html');
    this.parsedPath = path.join('parsed', id + '.txt');
}

function loadTasksFromDir(dir){
    var tasks = [];
    var entries = fs.readdirSync(dir);
    entries.forEach(function(entry){
        var entryPath = path.join(dir, entry);
        if(fs.statSync(entryPath).isFile()){
            var idx = entry.indexOf('.curl');
            if(idx !== -1){
                var id = entry.substr(0, idx);
                var task = new Task(id, entryPath);
                tasks.push(task);
            }
        }
    });
    return tasks;
}

function loadAllTasks(){
    var allTasks = [];

    allTasks = allTasks.concat(loadTasksFromDir('working'));
    allTasks = allTasks.concat(loadTasksFromDir('error'));
    allTasks = allTasks.concat(loadTasksFromDir('origin'));

    return allTasks;
}

exports.Task = Task;
exports.loadAllTasks = loadAllTasks;