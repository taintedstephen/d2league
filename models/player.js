const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
	psn: {
		type: String,
	},
	name: {
		type: String,
	},
	deleted: {
		type: Boolean,
		default: false,
	},
});

const Player = mongoose.model('Player', PlayerSchema);
module.exports = Player;
