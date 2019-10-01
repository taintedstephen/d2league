const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true,
	},
	password: {
		type: String,
		required: true,
		bcrypt: true,
	},
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

module.exports.createUser = (data, callback) => {
	const newUser = data;
	bcrypt.hash(newUser.password, 10, (err, hash) => {
		if (err) throw err;
		newUser.password = hash;
		newUser.save(callback);
	});
};

module.exports.updateUser = (id, data, callback) => {
	const newUser = data;
	if (
		newUser.password !== ''
		&& newUser.password !== undefined
		&& newUser.password !== null
	) {
		bcrypt.hash(newUser.password, 10, (err, hash) => {
			if (err) throw err;
			newUser.password = hash;
			User.update({ _id: id }, newUser, { upsert: false }, callback);
		});
	} else {
		User.update({ _id: id }, newUser, { upsert: false }, callback);
	}
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if (err) return callback(err);
		return callback(null, isMatch);
	});
};
