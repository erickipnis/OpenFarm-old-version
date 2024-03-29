// import controller and middleware folders which automatically calls index.js files
var controllers = require('./controllers');
var middleware = require('./middleware');

var router = function(app){

	app.get("/login", middleware.requiresSecure, middleware.requiresLogout, controllers.Account.loginPage);
	app.post("/login", middleware.requiresSecure, middleware.requiresLogout, controllers.Account.login);
	app.get("/signup", middleware.requiresSecure, middleware.requiresLogout, controllers.Account.signupPage);
	app.post("/signup", middleware.requiresSecure, middleware.requiresLogout, controllers.Account.signup);
	app.get("/logout", middleware.requiresLogin, controllers.Account.logout);
	app.get("/game", middleware.requiresLogin, controllers.Game.gamePage);
	app.get("/attributions", middleware.requiresSecure, controllers.Account.attributionsPage);
	app.get("/", middleware.requiresSecure, middleware.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;