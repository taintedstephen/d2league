const Match = require('../models/match');
const Player = require('../models/player');

exports.index = (req, res, next) => {
	Match.find({ })
		.populate('homePlayer awayPlayer'),
		.lean()
		.sort('matchWeek')
		.then((matches) => {
			res.render('matches/index', {
				title: 'Matches',
				matches,
			});
		})
		.catch(err => next(err));
};
