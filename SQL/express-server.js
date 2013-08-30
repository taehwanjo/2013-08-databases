var mysql = require('mysql');
var express = require('express');
var app = express();

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var dbConnection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chat"
});

dbConnection.connect(function(err){
  if(!err) {
    console.log("You are connected to the database.");
  }
});

app.use(express.bodyParser());

app.options('*', function(req,res){
  res.set(defaultCorsHeaders);
  res.end('');
});

// app.get('/', function(req,res){

// });

app.get('/classes/*', function(req, res){
  //if (req.is('xml')) {
  var roomName = req.url.slice(9);
  responseObj = {};
  responseObj.results = [];

  var queryString = "SELECT * FROM messages WHERE room='" + roomName + "' ORDER BY id DESC";
    dbConnection.query(queryString, function(err, rows, fields){
      if (err) throw (err);

      for (var i=0; i<rows.length; i++) {
        //console.log('Message: ', rows[i].text);
        var tempObj = {username: rows[i].username, text: rows[i].text, date: rows[i].date, roomname: rows[i].room};
        responseObj.results.push(tempObj);
      }

      //console.log(responseObj.results);

      res.contentType('application/json');
      res.set(defaultCorsHeaders);
      res.json(responseObj);
    });
  // } else {
  //   //browser output goes here
  //   res.contentType('text/html');
  //   res.set(defaultCorsHeaders);
  //   res.send("hi");
  // }

});

app.post('/classes/*', function(req, res){

  // var roomName = req.url.slice(9);
  // var username = req.body.username;
  // var text = req.body.text.replace("'", "\'");
  var post = {username: req.body.username, text: req.body.text, room: req.url.slice(9)};

  // var queryString = 
  // console.log(queryString);
  //var queryString = template({username: username, text: text, roomName: roomName});
   dbConnection.query("INSERT INTO messages SET ?", post, function(err, result){
     if (err) throw (err);
   });

  res.contentType('application/json');
  res.set(defaultCorsHeaders);
  res.json({success:true});
});

app.listen(8080);
console.log("Listening on port 8080");






