const Promise = require('bluebird');
const User = Promise.promisifyAll(require('../models/user'));

exports.login = (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/admin');
	} else {
		res.render('users/login', {
			title: 'Log In',
		});
	}
};

exports.postLogin = (req, res) => {
	req.flash('success', 'You are logged in');
	res.redirect('/');
};

exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'You have logged out');
	res.redirect('/');
};

exports.index = (req, res, next) => {
	User.find({})
		.lean()
		.sort('username')
		.then((users) => {
			res.render('users/index', {
				title: 'Users',
				users,
			});
		})
		.catch(err => next(err));
};

exports.new = (req, res) => {
	res.render('users/new', {
		title: 'Add new user',
	});
};

exports.create = (req, res, next) => {
	const {
		username,
		password,
	} = req.body;

	req.checkBody('username', 'Email field is required').notEmpty();
	req.checkBody('password', 'Password field is required').notEmpty();
	const errors = req.validationErrors();

	if (errors) {
		res.render('users/new', {
			title: 'Add new user',
			errors,
			username,
		});
	} else {
		const newUser = new User({
			username,
			password,
		});
		User.createUserAsync(newUser)
			.then(() => {
				req.flash('success', 'User Created');
				res.redirect('/users');
			})
			.catch(err => next(err));
	}
};

exports.edit = (req, res, next) => {
	const { id } = req.params;
	User.findById(id)
		.lean()
		.then((user) => {
			if (!user) throw new Error('User not found');
			res.render('users/edit', {
				title: 'Edit user',
				user,
			});
		})
		.catch(err => next(err));
};

exports.update = (req, res, next) => {
	const {
		id,
		username,
		password,
	} = req.body;

	req.checkBody('username', 'Email field is required').notEmpty();
	const errors = req.validationErrors();

	if (errors) {
		res.render('users/edit', {
			title: 'Edit user',
			errors,
			user: {
				username,
			},
		});
	} else {
		const userData = {
			username,
			password,
		};
		// TODO - validation
		User.updateUserAsync(id, userData)
			.then(() => {
				req.flash('success', 'User Updated');
				res.redirect('/users');
			})
			.catch(err => next(err));
	}
};

exports.destroy = (req, res, next) => {
	const { id } = req.body;
	User.remove({ _id: id })
		.then(() => {
			req.flash('success', 'User Deleted');
			res.redirect('/users');
		})
		.catch(err => next(err));
};
