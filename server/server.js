'use strict';

var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io').listen(http)
var serveStatic = require('serve-static')

var osc = require('node-osc')

var oscClient = new osc.Client('127.0.0.1', 9000)

app.use(serveStatic(__dirname))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('a user connected');

  oscClient.send('/status', 'connected')

  socket.on('data', function (data) {
	//console.log(data)
	
	for (var i = 0; i <= data.length; i++) {
		if (data[i]) {
			//console.log(data[i]);
			console.log('/'+data[i].emotion, data[i].value);
			oscClient.send('/'+data[i].emotion, [{
				type: 'float',
				value: data[i].value
			}], function () {
				console.log('sent')
			})
		}
	}
	
	/**/
  })
});