var _ = require('underscore');
var models = require('../models');

var Game = models.Game;

var gamePage = function(request, response){

	Game.GameModel.findByOwner(request.session.account._id, function(err, game){

		if (err){

			return response.status(400).json({error: "An error occurred."});
		}

		response.render('game', {gameData: game});
	});
};

module.exports.gamePage = gamePage;