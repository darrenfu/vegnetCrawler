var fs = require('fs');
var path = require('path');
var start = parseInt(process.argv[2]);
var end = parseInt(process.argv[3]);

function padZero(num, minLength) {
    var len = num.toString().length;
    while(len < minLength) {
        num = '0' + num;
        len++;
    }
    return num;
}

var dir = 'origin';
if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

for (var i = start; i <= end; i++) {
    var id = padZero(i, 6);
    var url  = 'http://www.vegnet.com.cn/Price/List_p' + id + '.html';
    var output = path.join('html', id + '.html');
    var config = [
        'url = ' + url,
        'output = ' + output,
//        'proxy = 10.99.60.90:8080',
        'max-time = 180', // total time > 180 seconds, abort
        'limit-rate = 5000', // limit download rate < 5K/s
//        'speed-time = 20',
//        'speed-limit = 500' // download speed slower than 500B/s for 20 seconds, abort
        'retry = 5'
    ];

    var text = config.join('\n');
    var fileName = id + '.curl';

    fs.writeFileSync(path.join(dir, fileName), text);
}