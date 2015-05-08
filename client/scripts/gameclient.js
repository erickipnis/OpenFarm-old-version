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

	var tileWidth = 40;
	var tileHeight = 40;

	// Connect the client socket
	socket = io.connect();

	// Get the canvas and canvas context 
	canvas = document.querySelector("#mainCanvas");
	ctx = canvas.getContext('2d');

	upButton = document.querySelector("#upButton");
	downButton = document.querySelector("#downButton");
	leftButton = document.querySelector("#leftButton");
	rightButton = document.querySelector("#rightButton");

	setupClientEvents(tileWidth, tileHeight);
	setupButtonEvents();
	setupMouseEvents(tileWidth, tileHeight);
}

window.onload = loadImages;

function update(tileWidth, tileHeight){

	draw(tileWidth, tileHeight);
}

function draw(tileWidth, tileHeight){

	// Redraw the tilemap
	drawTileMap(tileWidth, tileHeight);
}

function drawTileMap(tileWidth, tileHeight){

	var tileImageName;
	var tileImage;

	// Clear the canvas
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);	
			
	for (var j = 0; j < ctx.canvas.height; j += tileHeight){

		for (var i = 0; i < ctx.canvas.width; i += tileWidth){

			tileImageName = tileMap["Tile" + (j / tileHeight).toString() + (i / tileWidth).toString()].img;

			tileImage = preload.getResult(tileImageName);

			ctx.drawImage(tileImage, i, j);
		}
	}
}

function initializeTileMap(tileWidth, tileHeight){

	var tileImageName;
	var tileImage;

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

			tileImageName = tileMap["Tile" + (j / tileHeight).toString() + (i / tileWidth).toString()].img;

			tileImage = preload.getResult(tileImageName);

			ctx.drawImage(tileImage, i, j);
		}
	}
}

// Sets up the client-side, socket.io custom "on" event handlers to recieve data from the server
function setupClientEvents(tileWidth, tileHeight){

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

	socket.on("onTileMapSetup", function(tileMapObj){

		console.dir(tileMapObj);
		tileMap = tileMapObj;

		var tileMapSize = Object.keys(tileMap).length

		if (tileMapSize === 0){

			initializeTileMap(tileWidth, tileHeight);
		}
		else if (tileMapSize > 0){

			drawTileMap(tileWidth, tileHeight);
		}
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

function setupMouseEvents(tileWidth, tileHeight){

	canvas.onclick = function(event){

		if (event.which == 1){

			var playerData = {

				message: "left clicked!"
			};

			socket.emit("onLeftMouseClick", playerData);
		}

		var mouse = getMouse(event);

		var tileRow = Math.floor(mouse.y / tileHeight).toString();
		var tileColumn = Math.floor(mouse.x / tileWidth).toString();

		tileMap["Tile" + tileRow + tileColumn].img = images.tomato1;

		update(tileWidth, tileHeight);
		console.log(tileMap);

		//var stringifiedTileMap = JSON.stringify(tileMap);
		//console.log(stringifiedTileMap);

		//socket.emit("onTileMapChange", stringifiedTileMap);
		socket.emit("onTileMapChange", tileMap);
	};
}

function loadImages(){

	preload = new createjs.LoadQueue(false);

	preload.on("complete", function(){

		images = {

			soil: "soil",
			tomato1: "tomato1"
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