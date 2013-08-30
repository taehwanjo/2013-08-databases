var fs = require('fs');
var http = require('http');
var querystring = require('querystring');
var util = require('util');
var httpget = require('http-get');

var path = require('path');
//console.log(__dirname);
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "text/html"
};

var sendResponse = function(response, data, status) {
  status = status || 200;
  response.writeHead(status, headers);
  response.end(data);
};



module.exports.handleRequest = function (req, res) {
  console.log("NEW REQUEST! datadir=%s",exports.datadir);
  var newFilePath = path.join(exports.datadir, '../sites/');

  switch (req.method) {
    case 'GET':
      //console.log('request url: ' + req.url + typeof req.url);
      if (req.url === '/' || req.url === '/index.html' || req.url ==='/styles.css' || req.url ==='/favicon.ico') {
        if (req.url ==='/') req.url = '/index.html';
        console.log("user requested anything other than a archived webpage");
        fs.readFile(__dirname + '/public' + req.url, function(err, data){
          // res.write('hello');
          sendResponse(res, data);
        });
      } else {
        var websiteURL = req.url.slice(1);
        // if (newFilePath + req.url) { //if the url exists in the file system

        // } else {
        //   sendResponse(res, '404', 404);
        // }
        console.log("user is requesting an archived webpage");
        fs.readFile(newFilePath + websiteURL, function(err, data){
          if (err) {
            console.log('error:' + err);
            sendResponse(res, '404', 404); //assuming all errors are 404, fix later
          } else {
            sendResponse(res, data);
          }
        });
      }
      break;
    case 'POST':



    var fullBody = '';
      req.on('data', function(chunk) {
        fullBody += chunk.toString();
      });

      req.on('end', function(){

      var decodedBody = querystring.parse(fullBody);

      console.log('decodedBody: ' + decodedBody);
      console.log('inspectedBody: ' + util.inspect(decodedBody));

      //fx.exists
      console.log('EXPORTS.DATADIR!! (in post handler) ' + exports.datadir);
      console.log('About to append '+decodedBody.url);
      fs.appendFileSync(exports.datadir, decodedBody.url + '\n');
      console.log("finished appending");


        // fs.writeFile(newFilePath + decodedBody.url, 'hi', function(err){ //replace hi with html data
        //   if(err) {
        //     console.log(err);
        //   } else {
        //     console.log("The file was written!");
        //   }
        // });

      httpget.get('http://' + decodedBody.url, newFilePath + decodedBody.url, function(error, result){
        if (error) {
          console.error("Error while writing: "+error);
        } else {
          console.log('File was downloaded at: ' + result.file);
        }
      });

      });

      sendResponse(res, 'hiPOST', 302);
      break;
    case 'OPTIONS':
      sendResponse(res, 'hiOPTIONS');
      break;
    default:
      sendResponse(res, 'hiERROR', 404);
      break;
  }
};
