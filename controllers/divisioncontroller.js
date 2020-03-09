const Promise = require('bluebird');
const Player = require('../models/player');
const Division = require('../models/division');

exports.index = (req, res, next) => {
	Promise.all([
		Division.find()
			.lean()
			.sort('sortOrder')
			.populate('players'),
		Player.find({ division: null, deleted: false })
			.lean()
			.sort('psn'),
	])
		.spread((divisions, players) => {
			res.render('divisions/index', {
				title: 'Divisions',
				divisions,
				players,
			});
		})
		.catch(err => next(err));
}

exports.new = (req, res) => {
	res.render('divisions/new', {
		title: 'Add new Division',
	});
};

exports.create = (req, res, next) => {
	const { name } = req.body;

	req.checkBody('name', 'Name field is required').notEmpty();
	const errors = req.validationErrors();

	if (errors) {
		res.render('disisions/new', {
			title: 'Add new division',
			errors,
			name,
		});
	} else {
		const newDivision = new Division({
			name,
			sortOrder: 1,
		});
		newDivision.save()
			.then(() => {
				req.flash('success', 'Division Created');
				res.redirect('/divisions');
			})
			.catch(err => next(err));
	}
};

exports.edit = (req, res, next) => {
	const { id } = req.params;
	Division.findById(id)
		.lean()
		.then((division) => {
			if (!division) throw new Error('Division not found');
			res.render('divisions/edit', {
				title: 'Edit Division',
				division,
			});
		})
		.catch(err => next(err));
};

exports.update = (req, res, next) => {
	const {
		id,
		name,
	} = req.body;

	req.checkBody('name', 'Name field is required').notEmpty();
	const errors = req.validationErrors();

	if (errors) {
		res.render('divisions/edit', {
			title: 'Edit Division',
			errors,
			division: {
				name,
			},
		});
	} else {
		const divisionData = {
			name,
		};
		Division.findByIdAndUpdate(id, divisionData)
			.then(() => {
				req.flash('success', 'Division Updated');
				res.redirect('/divisions');
			})
			.catch(err => next(err));
	}
};

exports.destroy = (req, res, next) => {
	const { id } = req.body;
	Promise.all([
		Division.remove({ _id: id }),
		Player.update({ division: id }, { division: null }, { upsert: false }),
	])
		.then(() => {
			req.flash('success', 'Division Deleted');
			res.redirect('/divisions');
		})
		.catch(err => next(err));
};

exports.updateDivisionOrder = (req, res, next) => {
	const { order } = req.body;
	const divisionOrder = order.split(',');
	const divisionArray = [];
	for (let i = 0; i < divisionOrder.length; i++) {
		divisionArray.push({
			so: i,
			id: divisionOrder[i],
		});
	}
	Promise.map(divisionArray, item => Division.findByIdAndUpdate(item.id, { sortOrder: item.so }))
		.then(() => {
			res.sendStatus(200);
		})
		.catch(err => next(err));
};

exports.updatePlayerDivision = (req, res, next) => {
	const data = JSON.parse(req.body.data);
	const {
		players,
		divisions,
	} = data;
	Promise.map(players, player => Player.findByIdAndUpdate(player.id, { division: player.division }))
		.then(() => {
			Promise.map(divisions, (division) => {
				if (division.id !== null) {
					return Division.findByIdAndUpdate(division.id, { players: division.players });
				}
				return;
			})
		})
		.then(() => {
			res.sendStatus(200);
		})
		.catch((err) => {
			console.log(err);
			next(err)
		});
}
