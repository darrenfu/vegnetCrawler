var exec = require('child_process').exec;

var start = parseInt(process.argv[2]);
var end = parseInt(process.argv[3]);

var cmd = 'curl http://www.vegnet.com.cn/Price/List_p[#start#-#end#].html -K curl_config.txt -o "#1.txt"';

function padZero(num, minLength) {
    var len = num.toString().length;
    while(len < minLength) {
        num = '0' + num;
        len++;
    }
    return num;
}

start = padZero(start, 6);
end = padZero(end, 6);

cmd = cmd.replace(/#start#/, start).replace(/#end#/, end);
console.log(cmd);

exec(cmd, function (error, stdout, stderr) {
//    console.log(error);
//    console.log(stdout);
//    console.log(stderr);
});
