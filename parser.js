var cheerio = require('cheerio');
var fs = require('fs');

var parseFile = function(filePath, success, fail){
    var text = fs.readFileSync(filePath, 'utf-8');
    var parsed = parse(text);

//    console.log(parsed.length + '\n');
    if(parsed.length > 1000){ // success
        success(parsed);
    }
    else{ // error
        console.error(filePath);
        fail(parsed);
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

exports.parse = parse;
exports.parseFile = parseFile;
