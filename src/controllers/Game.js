var _ = require('underscore');
var models = require('../models');

var tileMap;

var Game = models.Game;

var gamePage = function(request, response){

	Game.GameModel.findByOwner(request.session.account._id, function(err, game){

		if (err){

			return response.status(400).json({error: "Could not find information in the database associated with the id that was queried."});
		}

		response.render('game', {gameData: game});
	});
};

module.exports.gamePage = gamePage;