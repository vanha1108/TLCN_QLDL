var fs = require('fs');
var formidable = require('formidable');
var PdfReader = require("pdfreader").PdfReader;
var filereader = require('./filereader');
var XLSX = require('xlsx');
const  path = require('path');

//module.exports = 
exports.readFilesHandler = function (filepath) {

    var content = "";
    let ext = filereader.getFileExtension(filepath);
    if ( ext == '.docx') {
        filereader.extract(filepath).then(function(res, err){
            if ( err ) { console.log(err); }
                content = res;
                console.log('TT: ' + content);
                return content;
            });
    } else {
        if ( ext == '.txt') {
            fs.readFile(filepath, 'utf8', function(err, data){
                if ( err ) console.log(err);
                content = data;
                console.log('TT: ' + content);
                return content;
            })
        }
    }
    return "No";
};