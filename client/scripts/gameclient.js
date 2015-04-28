"use strict";
//background-color: #01A611;
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

	/*var soilImg = new Image();

	soilImg.onload = function(){

		// Create a tile map by passing in the width and height of each tile
		createTileMap(40, 40, soilImg);
	}

	soilImg.src = "/resources/img/soil.png";*/
	createTileMap(40, 40);
}

window.onload = loadImages;

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

		console.log("Clicked on tile: [" + Math.floor((mouse.y / 40)) + ", " + Math.floor((mouse.x / 40)) + "]");
	};
}

function loadImages(){

	preload = new createjs.LoadQueue(false);

	preload.on("complete", function(){

		images = {

			soil: preload.getResult("soil"),
			tomato1: preload.getResult("tomat01")
		};

		init();
	});

	preload.loadFile({id:"soil", src:"/resources/img/soil.png"});
	preload.loadFile({id:"tomato1", src:"/resources/img/tomato1.png"});
}

function createTileMap(tileWidth, tileHeight){

	var LINE_WIDTH = 3;
	var LINE_COLOR = "black";

	var soilImg = preload.getResult("soil");

	ctx.save();
		
	// set some drawing state variables
	ctx.strokeStyle = LINE_COLOR;
	ctx.fillStyle = '#01A611';
	ctx.lineWidth = 0.5;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
	// Temporary vertical grid lines
	for (var x = 0; x < ctx.canvas.width; x += tileWidth) {

		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, ctx.canvas.height);
		ctx.stroke();
	}

	// Temporary horizontal grid lines
	for (var y = 0; y < ctx.canvas.height; y += tileHeight) {

		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(ctx.canvas.width, y);
		ctx.stroke();
	}	
			
	for (var j = 0; j < ctx.canvas.height; j += tileHeight){

		for (var i = 0; i < ctx.canvas.width; i += tileWidth){

			// TODO: make seperate one for when i = 0 or when j = 0 or make seperate counters

			tileMap["Tile" + (j / tileHeight).toString() + (i / tileWidth).toString()] = {

				xMin: i,
				xMax: i + tileWidth,
				yMin: j,
				yMax: j + tileHeight,
				img: images.soil
			} 

			ctx.drawImage(tileMap["Tile" + (j / tileHeight).toString() + (i / tileWidth).toString()], i, j);
		}
	}
		
	// restore the drawing state
	ctx.restore();
}

function getMouse(event){

	var mouse = {}
	mouse.x = event.pageX - event.target.offsetLeft;
	mouse.y = event.pageY - event.target.offsetTop;

	console.log(mouse);

	return mouse;
}

/*function sendAjaxData(action, data){

	$.ajax({

		cache: false,
		type: "GET",
		url: action,
		data: data,
		dataType: "json",
		success: function(result, status, xhr){

			window.location = result.redirect;
		},
		error: function(xhr, status, error){

			var jsonMsg = JSON.parse(xhr.responseText);

			console.log(jsonMsg.error);
		}
	});
}*/