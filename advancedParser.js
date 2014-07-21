var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');

var dirToParse = null; // directory where raw files exist
var fileToParse = null; // file to parse

var arg = process.argv[2];

if(!fs.existsSync(arg)){
    console.error(arg + ' not exist');
    process.exit(-1);
}

var parseFile = function(filePath){
    var text = fs.readFileSync(filePath, 'utf-8');
    var parsed = parse(text);

//    console.log(parsed.length + '\n');
    if(parsed.length > 1000){ // success
        console.log(parsed);
        // move to success
    }
    else{ // error
        console.error(filePath);
    }
};

// config start
var parse = function(body){
    var $ = cheerio.load(body);
    var str = '';
    var $records = $('.pri_k p');
    $records.each(function () {
        var $spans = $(this).find('span');
        $spans.each(function(index){
            str += $(this).text().trim();
            if(index < $spans.length - 2){
                str += '|';
            }
            else{
                str += '\n';
                return false;
            }
        });
    });

    return str;
};

var stat = fs.statSync(arg);
if(stat.isFile()){
    fileToParse = arg;
    parseFile(fileToParse);
}
else if(stat.isDirectory()){
    dirToParse = arg;
    var entries = fs.readdirSync(dirToParse);
    var files = [];
    entries.forEach(function(entry){
        var entryPath = path.join(dirToParse, entry);
        if(fs.statSync(entryPath).isFile()){
            files.push(entryPath);
        }
    });
    files.forEach(function(file){
        parseFile(file);
    });
}
else{
    console.error(arg + ' is neither directory nor file');
    process.exit(-1);
}

exports.parse = parse;