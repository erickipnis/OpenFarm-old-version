var models = require('../models');

var Account = models.Account;

var loginPage = function(request, response){

	response.render('login');
};

var signupPage = function(request, response){

	response.render('signup');
};

var gamePage = function(request, response){

	response.render('game');
}

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

		res.json({redirect: '/game'});
	});
};

var signup = function(request, response){

	if (!request.body.username || !request.body.pass || !request.body.pass2){

		return response.status(400).json({error: "All fields are required. Please fill out all of the fields!"});
	}

	if (!request.body.pass !== request.body.pass2){

		return response.status(400).json({error: "The passwords entered do not match. Please retype your password in both fields and try again."});
	}

	Account.AccountModel.generateHash(request.body.pass, function(salt, hash){

		var accountData = {

			username: request.body.username,
			salt: salt,
			password: hash
		};

		var newAccount = new Account.AccountModel(accountData);

		newAccount.save(function(err){

			if (err){

				console.log(err);
				return response.status(400).json({error: "An error occured"});
			}

			request.session.account = newAccount.toAPI();

			response.json({redirect: '/game'});
		});
	});
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
module.exports.gamePage = gamePage;