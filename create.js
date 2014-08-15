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
        'proxy = 10.99.60.90:8080',
        'retry = 0',
        'm = 1',
        'y = 2',
        'Y = 1000000' // download speed slower than 100B/s for 20 seconds, abort
//        '--connect-timeout = 0.1',
//        '--speed-time = 20',
//        '--speed-limit = 100' // download speed slower than 100B/s for 20 seconds, abort
    ];

    var text = config.join('\n');
    var fileName = id + '.curl';

    fs.writeFileSync(path.join(dir, fileName), text);
}