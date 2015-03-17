"use strict";

var http = require('http');
var fs = require('fs');
var socketIO = require('socket.io');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

var client = fs.readFileSync(__dirname + '/../client/client.html');

var app = http.createServer(onRequest).listen(port);

var io = socketIO(app);

var socket;

function onRequest(request, response){

	response.writeHead(200, {"Content-Type": "text/html"});

	response.write(client);

	response.end();
}

io.sockets.on('connection', function(socket){

	socket.join('room1');
});