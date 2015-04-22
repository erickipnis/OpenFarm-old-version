var path = require('path');
var express = require('express');
var compression = require('compression');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var RedisStore = require('connect-redis')(session) ;
var url = require('url');

var dbURL = process.env.MONGOLAB_URI || "mongodb://localhost/OpenFarm";

var db = mongoose.connect(dbURL, function(err){

	if (err){

		throw err;
	}
});

var redisURL = {

	hostname: 'localhost',
	port: 6379
};

var redisPass;

if (process.env.REDISCLOUD_URL){

	redisURL = url.parse(process.env.REDISCLOUD_URL);
	redisPass = redisURL.auth.split(':')[1];
}

// Bring in the page router
var router = require('./router.js');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use('/resources', express.static(path.resolve(__dirname + '../../client/')));
app.use(compression());

app.use(bodyParser.urlencoded({
	
	extended: true	
}));

app.use(session({

	store: new RedisStore({

		host: redisURL.hostname,
		port: redisURL.port,
		pass: redisPass
	}),

	secret: 'Open Farm',
	resave: true,
	saveUninitialized: true
}));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(favicon(__dirname + '/../client/img/favicon.png'));
app.use(cookieParser());

// Have the express server wait for a connection to the port which will also start up socket.io upon connecting
server.listen(port);

// Pass the app to the router to hook up all of the jade views
router(app);

function setupMovementEvents(){

	socket.on("onMoveUp", function(playerData){

		io.sockets.in("room1").emit("onMoveUp", playerData);
	});

	socket.on("onMoveDown", function(playerData){

		io.sockets.in("room1").emit("onMoveDown", playerData);
	});

	socket.on("onMoveLeft", function(playerData){

		io.sockets.in("room1").emit("onMoveLeft", playerData);
	});

	socket.on("onMoveRight", function(playerData){

		io.sockets.in("room1").emit("onMoveRight", playerData);
	});

}

function setupMouseEvents(){

	socket.on("onLeftMouseClick", function(playerData){

		io.sockets.in("room1").emit("onLeftMouseClick", playerData);
	});
}

io.sockets.on('connection', function(connectionSocket){

	socket = connectionSocket;

	socket.join('room1');

	setupMovementEvents();
	setupMouseEvents();
});
