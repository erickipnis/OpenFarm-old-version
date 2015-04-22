var models = require('../models');

var Account = models.Account;
var Game = models.Game;

var loginPage = function(request, response){

	response.render('login');
};

var signupPage = function(request, response){

	response.render('signup');
};

var logout = function(request, response){

	request.session.destroy();
	response.redirect('/');
};

var login = function(request, response){

	var username = request.body.username;
	var password = request.body.password;

	if (!username || !password){

		return response.status(400).json({error: "All fields are required. Please fill out all the fields!"});
	}

	Account.AccountModel.authenticate(username, password, function(err, account){

		if (err || !account){

			return response.status(401).json({error: "Wrong username or password entered. Please check your login details and try again."});
		}

		request.session.account = account.toAPI();

		response.json({redirect: '/game'});
	});
};

var signup = function(request, response){

	if (!request.body.username || !request.body.password || !request.body.password2){

		return response.status(400).json({error: "All fields are required. Please fill out all of the fields!"});
	}

	if (request.body.password !== request.body.password2){

		return response.status(400).json({error: "The passwords entered do not match. Please retype your password in both fields and try again."});
	}

	Account.AccountModel.generateHash(request.body.password, function(salt, hash){

		var accountData = {

			username: request.body.username,
			salt: salt,
			password: hash
		};

		var newAccount = new Account.AccountModel(accountData);

		newAccount.save(function(err){

			if (err){

				console.log(err);
				return response.status(400).json({error: "The username entered already exists. Please choose another username and try again!"});
			}

			request.session.account = newAccount.toAPI();

			var gameData = {

				user: request.body.username,
				owner: request.session.account._id
			};

			// Create a new game
			var game = new Game.GameModel(gameData);

			// Save the created game into mongodb
			game.save(function(err){

				if (err){

					console.log(err);
					return response.status(400).json({error: "Could not create game."});
				}

				response.json({redirect: '/game'});
			});
		});
	});
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;