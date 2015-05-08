var mongoose = require('mongoose');
var _ = require('underscore');

var GameModel;

var setUser = function(name){

	return _.escape(name).trim();
};

var GameSchema = new mongoose.Schema({

	user: {

		type: String,
		required: true,
		trim: true,
		set: setUser
	},

	owner: {

		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Account'
	},

	tileMap: {

		type: mongoose.SchemaTypes.Mixed,
		required: true,
		default: {}
	},

	dateCreated: {

		type: Date,
		default: Date.now
	}
});

GameSchema.methods.toAPI = function(){

	return {

		user: this.user,
		date: this.dateCreated
	};
};

GameSchema.statics.findByOwner = function(ownerId, callback){

	var search = {

		owner: mongoose.Types.ObjectId(ownerId)
	};

	return GameModel.findOne(search).select("user dateCreated tileMap").exec(callback);
};

GameSchema.statics.getTileMap = function(ownerId, callback){

	var search = {

		owner: mongoose.Types.ObjectId(ownerId)
	};

	return GameModel.findOne(search).select("tileMap").exec(callback);
	/*returnGameModel.findOne(search, function(err, game){

		if (err){

			return response.status(400).json({error: "Could not find information in the database associated with the id that was queried."});
		}

		// Assign the found game's tilemap to the updated tilemap
		game.tileMap = tileMap;

		// Save the game back into mongodb
		game.save();
	});*/
};

GameModel = mongoose.model('Game', GameSchema);

module.exports.GameModel = GameModel;
module.exports.GameSchema = GameSchema;