var mysql = require('mysql');
var express = require('express');
var app = express();

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};


var Sequelize = require("sequelize");
var sequelize = new Sequelize("chat", "root", "");

var Message = sequelize.define('Message', {
  username: Sequelize.STRING,
  text: Sequelize.TEXT,
  room: Sequelize.STRING
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


    Message.findAll({ where: {room: roomName}, order: '`createdAt` DESC' }).success(function(data) {
      console.log(data.length);

      for (var i = 0; i < data.length; i++) {
        responseObj.results.push({username: data[i].username, text: data[i].text, room: data[i].room, createdAt: data[i].createdAt});
      }

      res.contentType('application/json');
      res.set(defaultCorsHeaders);
      res.json(responseObj);
    });


});

app.post('/classes/*', function(req, res){

  var post = {username: req.body.username, text: req.body.text, room: req.url.slice(9)};


    var newMessage = Message.create(post);


  res.contentType('application/json');
  res.set(defaultCorsHeaders);
  res.json({success:true});
});

app.listen(8080);
console.log("Listening on port 8080");






