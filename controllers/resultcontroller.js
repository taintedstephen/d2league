const Promise = require('bluebird');
const Match = require('../models/match');
const Player = require('../models/player');
const { makeFixtures, showFixtures } = require('../lib/fixtures');


exports.index = (req, res, next) => {
	Match.find({})
		.populate('homePlayer awayPlayer')
		.lean()
		.then((matches) => {
			const fixtures = showFixtures(matches);
			res.render('results/index', {
				title: 'Results',
				fixtures,
			})
		})
		.catch(err => next(err));
};

exports.generate = (req, res, next) => {
	Player.find({ deleted: false })
		.lean()
		.then((players) => {
			const weeks = makeFixtures(players);
			const weeksEncoded = JSON.stringify(weeks);
			res.render('results/generate', {
				title: 'Generated Fixtures',
				weeks,
				weeksEncoded,
			});
		})
		.catch(err => next(err));
};

exports.saveSchedule = (req, res, next) => {
	const { weeksEncoded } = req.body;
	const weeks = JSON.parse(weeksEncoded);
	const fixtures = [];

	weeks.forEach((week) => {
		week.fixtures.forEach((fixture) => {
			const newFixture = new Match({
				matchWeek: week.week,
				homePlayer: fixture.homePlayer._id,
				awayPlayer: fixture.awayPlayer._id,
			});
			fixtures.push(newFixture);
		});
	});

	Promise.map(fixtures, fixture => fixture.save())
		.then(() => {
			req.flash('success', 'Fixtures generated');
			res.redirect('/results');
		})
		.catch(err => next(err));
};

exports.purge = (req, res, next) => {
	Match.remove({})
		.then(() => {
			req.flash('success', 'All matches deleted');
			res.redirect('/results');
		})
		.catch(err => next(err));
};

exports.add = (req, res, next) => {
	const { id } = req.params;
	Match.findById(id)
		.populate('homePlayer awayPlayer')
		.lean()
		.then((match) => {
			res.render('results/add-score', {
				title: 'Add a result',
				match,
			});
		})
		.catch(err => next(err));
};

exports.edit = (req, res, next) => {
	const { id } = req.params;
	Match.findById(id)
		.populate('homePlayer awayPlayer')
		.lean()
		.then((match) => {
			res.render('results/edit-score', {
				title: 'Edit score',
				match,
			});
		})
		.catch(err => next(err));
};

exports.save = (req, res, next) => {
	const {
		id,
		homeScore,
		awayScore,
		outcome,
	} = req.body;
	const scoreData = {
		homeScore,
		awayScore,
		outcome,
		hasResult: true,
		resultDate: Date.now(),
	};
	Match.update({ _id: id }, scoreData, { upsert: false })
		.then(() => {
			req.flash('success', 'Score updated');
			res.redirect('/results');
		})
		.catch(err => next(err));
};
