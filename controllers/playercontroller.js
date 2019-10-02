const Player = require('../models/player');

exports.index = (req, res, next) => {
	Player.find({ deleted: false })
		.lean()
		.sort('psn')
		.then((players) => {
			res.render('players/index', {
				title: 'Players',
				players,
			});
		})
		.catch(err => next(err));
};

exports.new = (req, res) => {
	res.render('players/new', {
		title: 'Add new player',
	});
};

exports.create = (req, res, next) => {
	const {
		psn,
		name,
	} = req.body;

	req.checkBody('psn', 'PSN field is required').notEmpty();
	const errors = req.validationErrors();

	if (errors) {
		res.render('players/new', {
			title: 'Add new player',
			errors,
			psn,
			name,
		});
	} else {
		const newPlayer = new Player({
			psn,
			name,
		});
		newPlayer.save()
			.then(() => {
				req.flash('success', 'Player Created');
				res.redirect('/players');
			})
			.catch(err => next(err));
	}
};

exports.edit = (req, res, next) => {
	const { id } = req.params;
	Player.findById(id)
		.lean()
		.then((player) => {
			if (!player) throw new Error('Player not found');
			res.render('players/edit', {
				title: 'Edit player',
				player,
			});
		})
		.catch(err => next(err));
};

exports.update = (req, res, next) => {
	const {
		id,
		psn,
		name,
	} = req.body;

	req.checkBody('psn', 'PSN field is required').notEmpty();
	const errors = req.validationErrors();

	if (errors) {
		res.render('players/edit', {
			title: 'Edit player',
			errors,
			player: {
				psn,
				name,
			},
		});
	} else {
		const playerData = {
			psn,
			name,
		};
		Player.findByIdAndUpdate(id, playerData)
			.then(() => {
				req.flash('success', 'Player Updated');
				res.redirect('/players');
			})
			.catch(err => next(err));
	}
};

exports.destroy = (req, res, next) => {
	const { id } = req.body;
	Player.findByIdAndUpdate(id, { deleted: true })
		.then(() => {
			req.flash('success', 'Player Deleted');
			res.redirect('/players');
		})
		.catch(err => next(err));
};
