var cheerio = require('cheerio');

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

    if(str.length > 1000){ // success
        return str;
    }
    else{ // error
        return -1;
    }
};

exports.parse = parse;