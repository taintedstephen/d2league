const Promise = require('bluebird');
const Player = require('../models/player');
const Match = require('../models/match');
const { playerRow } = require('../lib/table');
const { showFixturesNoButtons } = require('../lib/fixtures');

exports.index = (req, res, next) => {
	Promise.all([
		Player.find({ deleted: false })
			.lean(),
		Match.find({ hasResult: true })
			.lean(),
	])
		.spread((players, results) => {
			const table = players.map(player => playerRow(player, results));
			table.sort((a, b) => {
				if (a.points === b.points) {
					if (a.diff === b.diff) {
						return a.kills > b.kills ? -1 : 1;
					}
					return a.diff > b.diff ? -1 : 1;
				}
				return a.points > b.points ? -1 : 1;
			});

			let i = 1;
			table.forEach((player) => {
				player.rank = i;
				i += 1;
			});
			res.render('index', {
				title: 'Dan\'s 1v1 League Season 2 - Table',
				table,
			});
		})
		.catch(err => next(err));
};

exports.fixtures = (req, res, next) => {
	Match.find({})
		.populate('homePlayer awayPlayer')
		.lean()
		.then((matches) => {
			const fixtures = showFixturesNoButtons(matches);
			res.render('fixtures', {
				title: 'Dan\'s 1v1 League Season 2 - Fixtures',
				fixtures,
			})
		})
		.catch(err => next(err));
};

exports.rules = (req, res) => {
	res.render('rules', {
		title: 'Dan\'s 1v1 League Season 2 - Rules',
	});
};

exports.seasonOne = (req, res) => {
	res.render('history/season-one', {
		title: 'Dan\'s 1v1 League Season 2 - Season One Review',
	});
};

exports.login = (req, res) => {
	res.render('users/login', {
		title: 'Login',
	});
};
