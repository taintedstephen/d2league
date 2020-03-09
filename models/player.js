const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
	psn: {
		type: String,
	},
	name: {
		type: String,
	},
	division: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Division',
	},
	deleted: {
		type: Boolean,
		default: false,
	},
});

const Player = mongoose.model('Player', PlayerSchema);
module.exports = Player;
