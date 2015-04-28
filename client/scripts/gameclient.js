"use strict";

var socket;
var canvas;
var ctx;

var upButton;
var downButton;
var leftButton;
var rightButton;

var tileMap;

var preload;

var images;

function init(){

	// Connect the client socket
	socket = io.connect();

	// Get the canvas and canvas context 
	canvas = document.querySelector("#mainCanvas");
	ctx = canvas.getContext('2d');

	upButton = document.querySelector("#upButton");
	downButton = document.querySelector("#downButton");
	leftButton = document.querySelector("#leftButton");
	rightButton = document.querySelector("#rightButton");

	tileMap = {};

	setupClientEvents();
	setupButtonEvents();
	setupMouseEvents();

	initializeTileMap(40, 40);
}

window.onload = loadImages;

function update(){

	draw();
}

function draw(){

	// Redraw the tilemap
	drawTileMap(40, 40);
}

function drawTileMap(tileWidth, tileHeight){

	// Clear the canvas
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);	
			
	for (var j = 0; j < ctx.canvas.height; j += tileHeight){

		for (var i = 0; i < ctx.canvas.width; i += tileWidth){

			ctx.drawImage(tileMap["Tile" + (j / tileHeight).toString() + (i / tileWidth).toString()].img, i, j);
		}
	}
}

function initializeTileMap(tileWidth, tileHeight){

	// Clear the canvas
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);	
			
	for (var j = 0; j < ctx.canvas.height; j += tileHeight){

		for (var i = 0; i < ctx.canvas.width; i += tileWidth){

			tileMap["Tile" + (j / tileHeight).toString() + (i / tileWidth).toString()] = {

				xMin: i,
				xMax: i + tileWidth,
				yMin: j,
				yMax: j + tileHeight,
				img: images.soil
			} 

			ctx.drawImage(tileMap["Tile" + (j / tileHeight).toString() + (i / tileWidth).toString()].img, i, j);
		}
	}
}

// Sets up the client-side, socket.io custom "on" event handlers to recieve data from the server
function setupClientEvents(){

	socket.on("onMoveUp", function(playerData){

		console.log("The player " + playerData.message);
	});

	socket.on("onMoveDown", function(playerData){

		console.log("The player " + playerData.message);
	});

	socket.on("onMoveLeft", function(playerData){

		console.log("The player " + playerData.message);
	});

	socket.on("onMoveRight", function(playerData){

		console.log("The player " + playerData.message);
	});

	socket.on("onLeftMouseClick", function(playerData){

		console.log("The player " + playerData.message);
	});
}

// Sets up the button "onclick" events to handle sending data to the server through socket.io
function setupButtonEvents(){

	upButton.onclick = function(){

		var playerData = {

			message: "moved up!"
		};

		socket.emit("onMoveUp", playerData);
	};

	downButton.onclick = function(){

		var playerData = {

			message: "moved down!"
		};

		socket.emit("onMoveDown", playerData);
	};

	leftButton.onclick = function(){

		var playerData = {

			message: "moved left!"
		};

		socket.emit("onMoveLeft", playerData);
	};

	rightButton.onclick = function(){

		var playerData = {

			message: "moved right!"
		};

		socket.emit("onMoveRight", playerData);
	};
}

function setupMouseEvents(){

	canvas.onclick = function(event){

		if (event.which == 1){

			var playerData = {

				message: "left clicked!"
			};

			socket.emit("onLeftMouseClick", playerData);
		}

		var mouse = getMouse(event);

		tileMap["Tile" + (Math.floor(mouse.y / 40)).toString() + (Math.floor(mouse.x / 40)).toString()].img = images.tomato1;

		update();
	};
}

function loadImages(){

	preload = new createjs.LoadQueue(false);

	preload.on("complete", function(){

		images = {

			soil: preload.getResult("soil"),
			tomato1: preload.getResult("tomato1")
		};

		init();
	});

	preload.loadFile({id:"soil", src:"/resources/img/soil.png"});
	preload.loadFile({id:"tomato1", src:"/resources/img/tomato1.png"});
}

function getMouse(event){

	var mouse = {}
	mouse.x = event.pageX - event.target.offsetLeft;
	mouse.y = event.pageY - event.target.offsetTop;

	return mouse;
}