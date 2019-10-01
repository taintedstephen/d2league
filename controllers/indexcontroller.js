const Promise = require('bluebird');
const Player = require('../models/player');
const Result = require('../models/result');

exports.index = (req, res, next) => {
	Promise.all([
		Player.find({})
			.lean(),
		Result.find({})
			.sort('-resultDate')
			.lean(),
	])
		.spread((players, results) => {
			const table = players.map(player => playerRow(player, results));
			table.sort((a, b) => {
				if (a.points === b.points) {
					if (a.diff === b.diff) {
						return a.kills > b.kills ? 1 : -1;
					}
					return a.diff > b.diff ? 1 : -1;
				}
				return a.points > b.points ? 1 : -1;
			});
			let i = 1;
			table.forEach((player) => {
				player.rank = i;
				i += 1;
			});
			res.render('index', {
				title: 'PhRe PVP League Table',
				table,
			});
		})
		.catch(err => next(err));
}

function getPoints(myScore, theirScore) {
	if (myScore > theirScore) {
		return 3;
	} else if (theirScore > myScore) {
		return 0;
	} else {
		return 1;
	}
}

function getResult(myScore, theirScore) {
	if (myScore > theirScore) {
		return 'W';
	} else if (theirScore > myScore) {
		return 'L';
	} else {
		return 'D';
	}
}

function playerRow(player, results) {
	const data = {
		psn: player.psn,
		name: player.name,
		rank: 0,
		kills: 0,
		deaths: 0,
		diff: 0,
		kdratio: 0,
		played: 0,
		won: 0,
		drawn: 0,
		lost: 0,
		points: 0,
	};

	results.forEach((result) => {
		if (
			result.homePlayer.toString() === player._id.toString()
			|| result.awayPlayer.toString() === player._id.toString()
		) {
			const homePlayer = (result.homePlayer.toString() === player._id.toString());
			data.played += 1;
			if (homePlayer) {
				data.kills += result.homeScore;
				data.deaths += result.awayScore;
				data.points += getPoints(result.homeScore, result.awayScore);
				const result = getResult(result.homeScore, result.awayScore);
				if (result === 'W') {
					data.won += 1;
				} else if (result = 'L') {
					data.lost += 1;
				} else {
					data.drawn += 1;
				}
			} else {
				data.kills += result.awayScore;
				data.deaths += result.homeScore;
				data.points += getPoints(result.awayScore, result.homeScore);
				const result = getResult(result.awayScore, result.homeScore);
				if (result === 'W') {
					data.won += 1;
				} else if (result = 'L') {
					data.lost += 1;
				} else {
					data.drawn += 1;
				}
			}
		}
	});
	data.diff = data.kills - data.deaths;
	data.kdratio = ((Math.round(data.kills / data.deaths * 100)) / 100).toFixed(2);
	return data;
};

function playerForm (player, results) {

};

exports.login = (req, res) => {
	res.render('users/login', {
		title: 'Login',
	});
};

exports.admin = (req, res) => {
	res.send('Logged in you bastard');
};
