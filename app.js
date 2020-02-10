require('dotenv').config({ silent: true });
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const expressMessages = require('express-messages');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const helmet = require('helmet');
const csrf = require('csurf');
mongoose.Promise = require('bluebird');
const db = mongoose.connection;

const routes = require('./routes/index');
const users = require('./routes/users');
const players = require('./routes/players');
const results = require('./routes/results');

const app = express();
app.use(helmet());

/* global process */

mongoose.connect(process.env.MONGODB_URI, {
	useMongoClient: true,
	reconnectTries: Number.MAX_VALUE,
	reconnectInterval: 1000,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');

app.set('layout', 'layouts/default');
app.set('partials', {
	header: 'includes/header',
	footer: 'includes/footer',
	token: 'includes/csrf_token',
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }));

// Handle Express Sessions
app.use(session({
	secret: 'vt877nv87v4',
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db,
		ttl: 3600,
	}),
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(expressValidator({
	errorFormatter: (p, msg, value) => {
		const namespace = p.split('.');
		const root = namespace.shift();
		let param = root;

		while (namespace.length) {
			param += `[${namespace.shift()}]`;
		}
		return {
			param,
			msg,
			value,
		};
	},
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use((req, res, next) => {
	res.locals.messages = expressMessages(req, res);
	next();
});

const csrfProtection = csrf({ cookie: true });

app.all('*', csrfProtection, (req, res, next) => {
	res.locals.user = req.user || null;
	res.locals._csrfToken = req.csrfToken();
	next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/players', players);
app.use('/results', results);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

if (app.get('env') !== 'development') {
	app.use((req, res, next) => {
		if (req.headers['x-forwarded-proto'] === 'http') {
			return res.redirect(`https://${req.get('host')}${req.url}`);
		}
		return next();
	});
}

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err,
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {},
	});
});

module.exports = app;
