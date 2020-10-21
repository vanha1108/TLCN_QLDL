var fs = require('fs');
var formidable = require('formidable');
var PdfReader = require("pdfreader").PdfReader;
var filereader = require('./filereader');
var XLSX = require('xlsx');
const  path = require('path');

module.exports = readFilesHandler = async (req, res) => {
    
    var form = new formidable.IncomingForm({ multiples: true });
    var filecontent;
    
    if(req.url = '/upload') {
        form.parse(req, function (err, fields, files) {

            let filename = files.filedoc.name;

            let filePath = path.resolve(__dirname, 'public/uploads/' + filename)
                
            fs.readFile(filePath, (err, data) => {

                let filebuffer = data;
            
                var fileextension = filereader.getFileExtension(filename);

                console.log("Exten:" + fileextension);

                if ( fileextension == '.docx' || fileextension == '.doc')
                {
                    console.log('word');
                } else {
                    if ( fileextension == '.txt' || fileextension == '.csv' )
                    {
                        console.log('txt');
                    }
                }
            
                    
            
                // switch (fileextension) {
                //     case '.docx'||'.doc':
                //         console.log("READ")
                //         break;
                //     case '.txt' || '.csv':
                //         console.log('txt');
                //         fs.readFile('D:/nodejs/QLDL/public/uploads/file2.docx', function read(err, data) {
                //             if (err) {
                //                 throw err;
                //             }
                //             filecontent = data;
                //         });                
                //         break;
                //     default:
                //         console.log('default');
                //         filereader.extract(filePath).then(function (res, err) {
                //             if (err) {
                //                 console.log(err);
                //             }
                            
                //             filecontent = res;
                
                //         })
                //         break;
                //     };
            });
        });
    }
};





