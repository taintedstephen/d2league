const Promise = require('bluebird');
const apiKey = process.env.BUNGIE_API_KEY;
const endPoint = 'https://bungie.net/Platform/Destiny2/';
const endPointv2 = 'https://bungie.net/Platform/GroupV2/';
const platform = 'ps4';
const membershipType = '2';

const pvpKeyConversion = {
	'numEventsPvp': 'activitiesEntered',
    'numWinsPvp': 'activitiesWon',
    'winLossRatioPvp': 'winLossRatio',
    'kdPvp': 'killsDeathsRatio',
    'durationPlayedPvp': 'totalActivityDurationSeconds',
    'favoriteWeaponPvp': 'weaponBestType',
    'mostKillsPvp': 'bestSingleGameKills',
    'longestKillSpreePvp': 'longestKillSpree',
    'suicideRatePvp': 'suicides'
};

const request = require('request');

exports.getPvpStats = (req, res, next) => {
	getPlayerId(req.params.psn)
		.then(playerId => fetchStats(playerId))
		.then((stats) => {
			res.json(stats.Response.allPvP.allTime);
		})
		.catch((err) => {
			console.log(err);
			next(err)
		});
};

const getPlayerId = (psn) => {
	return new Promise((resolve, reject) => {
		const url = `${endPoint}SearchDestinyPlayer/${membershipType}/${psn}/`;
		const options = {
			url,
			headers: {
				'X-API-Key': apiKey
			},
		};
		request(options, (err, response) => {
			if (err) reject(err);
			try {
				const info = JSON.parse(response.body);
				resolve(info.Response[0].membershipId);
			} catch (e) {
				reject('Failed to decode JSON');
			}
		});
	});
};

const fetchStats = (playerId) => {
	return new Promise((resolve, reject) => {
		let url = `${endPoint}${membershipType}/Account/${playerId}/Character/0/Stats/?modes=5`;
		const options = {
			url,
			headers: {
				'X-API-Key': apiKey
			},
		};
		request(options, (err, response) => {
			if (err) reject(err);
			try {
				const info = JSON.parse(response.body);
				resolve(info);
			} catch (e) {
				reject('Failed to decode JSON');
			}
		});
	});
}
