const mongoose = require('mongoose');

const MatchSchema = mongoose.Schema({
	homePlayer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Player',
	},
	awayPlayer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Player',
	},
	division: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Division',
	},
	homeScore: {
		type: Number,
	},
	awayScore: {
		type: Number,
	},
	outcome: {
		type: String,
	},
	hasResult: {
		type: Boolean,
		default: false,
	},
	matchWeek: {
		type: Number,
	},
	resultDate: {
		type: Date,
	},
});

const Match = mongoose.model('Match', MatchSchema);
module.exports = Match;
