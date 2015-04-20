var requiresLogin = function(request, response, next){

	if (!request.session.account){

		return response.redirect('/');
	}

	next();
};

var requiresLogout = function(request, response, next){

	if (request.session.account){

		return response.redirect('/game');
	}

	next();
};

var requiresSecure = function(request, response, next){

	if (request.headers['x-forwarded-proto'] != 'https'){

		return response.redirect("https://" + request.host + request.url);
	}

	next();
};

var bypassSecure = function(request, response, next){

	next();
};

if (process.env.NODE_ENV === "production"){

	module.exports.requiresSecure = requiresSecure;
}
else {

	module.exports.requiresSecure = bypassSecure;
}

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;