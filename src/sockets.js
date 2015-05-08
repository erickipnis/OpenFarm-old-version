var models = require('./models');

function setupMovementEvents(socket){

	socket.on("onMoveUp", function(playerData){

		socket.emit("onMoveUp", playerData);
	});

	socket.on("onMoveDown", function(playerData){

		socket.emit("onMoveDown", playerData);
	});

	socket.on("onMoveLeft", function(playerData){

		socket.emit("onMoveLeft", playerData);
	});

	socket.on("onMoveRight", function(playerData){

		socket.emit("onMoveRight", playerData);
	});
}

function setupMouseEvents(socket){

	socket.on("onLeftMouseClick", function(playerData){

		socket.emit("onLeftMouseClick", playerData);
	});
}

function setupTileMap(socket){

	socket.on("onTileMapChange", function(clientTileMap){

		updateTileMap(socket, clientTileMap);
	});

	models.Game.GameModel.getTileMap(socket.session.account._id, function(err, game){

		if (err){

				console.log("Unable to update tilemap!");
				throw err;
		}

		// Emit the tileMap from mongodb to the client upon connection to socket.io
		socket.emit("onTileMapSetup", game.tileMap);
	});
}

function updateTileMap(socket, clientTileMap){

	// Find the associated game attached to this session's account to have its tilemap updated
	models.Game.GameModel.getTileMap(socket.session.account._id, function(err, game){

		if (err){

			console.log("Unable to update tilemap!");
			throw err;
		}

		game.tileMap = clientTileMap;

		// Save the tilemap back to mongodb
		game.save();
	});
}

function setupConnection(io){

	io.sockets.on('connection', function(socket){

		setupMovementEvents(socket);
		setupMouseEvents(socket);
		setupTileMap(socket);
	});
}

module.exports.setupConnection = setupConnection;