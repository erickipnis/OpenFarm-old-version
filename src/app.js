var path = require('path');
var express = require('express');
var compression = require('compression');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var Session = session.Session;
var RedisStore = require('connect-redis')(session);
var url = require('url'); 
var cookie = require('cookie');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var sockets = require('./sockets.js');
var ioRedis = require('socket.io-redis');
var router = require('./router.js');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

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

var sessionStore = new RedisStore({

		host: redisURL.hostname,
		port: redisURL.port,
		pass: redisPass
});

app.use('/resources', express.static(path.resolve(__dirname + '../../client/')));
app.use(compression());

app.use(bodyParser.urlencoded({
	
	extended: true	
}));

app.use(session({

	key: "openfarm.sid",

	store: sessionStore,

	secret: 'Open Farm',
	resave: true,
	saveUninitialized: true
}));


// Setup socket.io-redis to be able to store session id in redis and use in socket.io server side for mongodb queries
var ioRedisClient = require('socket.io-redis/node_modules/redis').createClient,
	ropts = {/*Redis Options*/}, subOpts = {detect_buffers: true},
	pub = ropts.socket ? ioRedisClient(ropts.socket) : ioRedisClient(ropts.port, ropts.host),
	sub = ropts.socket ? ioRedisClient(ropts.socket, subOpts) : ioRedisClient(ropts.port, ropts.host, subOpts);

if (ropts.pass) {

	pub.auth(ropts.pass, function(err){

		if (err){

			throw err;
		}
	});

	sub.auth(ropts.pass, function(err){

		if (err){

			throw err;
		}
	});
}

io.adapter(require('socket.io-redis')({

	pubClient: pub, 
	subClient: sub
}));

//var socketStorage = ioRedisClient();

// Allow socket.io to hold onto the session through redis client
io.use(function(socket, callback){

	if (!socket.handshake.headers.cookie){

		return callback(new Error("No cookie was found on authorization request!"));
	}

	socket.cookie = cookie.parse(socket.handshake.headers.cookie);
	socket.sessionId = socket.cookie['openfarm.sid'].substring(2, 34);
	//console.log(socket.cookie['openfarm.sid']);

	sessionStore.load(socket.sessionId, function(err, session){

		if (err || !session){

			return callback(new Error("Session was not found!"));
		}

		if (!session && !session.account){

			return callback(new Error("User does not have proper authentication!"));
		}

		socket.session = new Session(socket, session);

		callback(null, true);
	});
});

//sockets.configureSockets(io, socketStorage);

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(favicon(__dirname + '/../client/img/favicon.png'));
app.use(cookieParser());

// Have the express server wait for a connection to the port which will also start up socket.io upon connecting
server.listen(port);

sockets.setupConnection(io);

// Pass the app to the router to hook up all of the jade views
router(app);