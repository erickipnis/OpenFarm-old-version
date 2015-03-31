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

function setupMovementEvents(){

	socket.on("onMoveUp", function(playerData){

		io.sockets.in("room1").emit("onMoveUp", playerData);
	});

	socket.on("onMoveDown", function(playerData){

		io.sockets.in("room1").emit("onMoveDown", playerData);
	});

	socket.on("onMoveLeft", function(playerData){

		io.sockets.in("room1").emit("onMoveLeft", playerData);
	});

	socket.on("onMoveRight", function(playerData){

		io.sockets.in("room1").emit("onMoveRight", playerData);
	});

}

function setupMouseEvents(){

	socket.on("onLeftMouseClick", function(playerData){

		io.sockets.in("room1").emit("onLeftMouseClick", playerData);
	});
}

io.sockets.on('connection', function(connectionSocket){

	socket = connectionSocket;

	socket.join('room1');

	setupMovementEvents();
	setupMouseEvents();
});