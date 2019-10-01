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
	homeScore: {
		type: Number,
	},
	awayScore: {
		type: Number,
	},
	outcome: {
		type: String,
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
