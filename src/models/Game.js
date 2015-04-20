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

	return GameModel.find(search).select("user dateCreated").exec(callback);
};

GameModel = mongoose.model('Game', GameSchema);

module.exports.GameModel = GameModel;
module.exports.GameSchema = GameSchema;