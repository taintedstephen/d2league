require('dotenv').config({ silent: true });
const Promise = require('bluebird');
const User = Promise.promisifyAll(require('../models/user'));
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const db = mongoose.connection;

mongoose.connect(process.env.MONGODB_URI, {
	useMongoClient: true,
	reconnectTries: Number.MAX_VALUE,
	reconnectInterval: 1000,
});

const user = new User({
	username: 'karloose',
	password: 'password',
});

User.createUserAsync(user)
	.then(() => {
		console.log('Database seeded');
		process.exit(1);
	})
	.catch((err) => {
		console.log('Error seeding database');
		console.log(err)
		process.exit(1);
	});
