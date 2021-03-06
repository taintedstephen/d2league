const express = require('express');
const router = express.Router();
const passport = require('passport');
const Promise = require('bluebird');
const LocalStrategy = require('passport-local').Strategy;
const UserController = require('../controllers/usercontroller');
const User = Promise.promisifyAll(require('../models/user'));
const { ensureAuthenticated } = require('../lib/auth');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => done(err, user));
});

passport.use(new LocalStrategy((username, password, done) => {
	User.findOne({ username })
		.then((user) => {
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}
			return [
				user,
				User.comparePasswordAsync(password, user.password),
			];
		})
		.spread((user, isMatch) => {
			if (isMatch) {
				return done(null, user);
			}
			return done(null, false, { message: 'Invalid Password' });
		})
		.catch(err => done(null, false, { message: err }));
}));

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/login',
	failureFlash: true,
}), UserController.postLogin);

router.post('/logout', UserController.logout);

router.get('/', ensureAuthenticated, UserController.index);
router.get('/new', ensureAuthenticated, UserController.new);
router.post('/create', ensureAuthenticated, UserController.create);
router.get('/edit/:id', ensureAuthenticated, UserController.edit);
router.post('/update', ensureAuthenticated, UserController.update);
router.post('/remove', ensureAuthenticated, UserController.destroy);

module.exports = router;
