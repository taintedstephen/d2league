const _ = require('underscore');
const moment = require('moment');
const weekOne = moment('11-02-20', 'DD-MM-YY');

exports.makeFixtures = (input) => {
	const players = input.sort(() => Math.random() - 0.5);
	players.push({ psn: '___blank___' });
	const playerCount = players.length;
	let offset = 1;
	let week = 1;
	const weeks = [];
	while (offset < playerCount) {
		const weekFixtures = [];
		for (let player = 0; player < playerCount; player++) {
			const offsetPlayer = (player + offset) % playerCount;
			if (
				players[player].psn !== '___blank___'
				&& players[offsetPlayer].psn !== '___blank___'
			) {
				weekFixtures.push({
					homePlayer: {
						_id: players[player]._id,
						psn: players[player].psn,
					},
					awayPlayer: {
						_id: players[offsetPlayer]._id,
						psn: players[offsetPlayer].psn,
					},
				});
			}
		}
		const fixtures = _.sortBy(weekFixtures, item => item.homePlayer.psn);
		weeks.push({
			week: offset,
			fixtures,
		});
		offset += 1;
		week += 1;
	}
	return weeks;
};

exports.showFixtures = (input) => {
	const groupedInput = _.groupBy(input, item => item.matchWeek);
	const weeks = [];
	for (let weekNum in groupedInput) {
		let weekWeek = parseInt(weekNum);
		if (weekNum >= 9) {
			weekWeek += 2;
		}
		const sortedFixtures = _.sortBy(groupedInput[weekNum], item => item.homePlayer.psn);
		const fixtures = sortedFixtures.map((sfx) => {
			const fixture = sfx;
			fixture.homeScoreHtml = '';
			fixture.homePlayerClass = '';
			fixture.awayScoreHtml = '';
			fixture.awayPlayerClass = '';
			fixture.noteHtml = '';
			if (fixture.hasResult) {
				fixture.homeScoreHtml = `<span class="fixture-score">${fixture.homeScore}</span>`;
				fixture.awayScoreHtml = `<span class="fixture-score">${fixture.awayScore}</span>`;
				fixture.showEditButton = true;
				if (fixture.homeScore > fixture.awayScore) {
					fixture.homePlayerClass = ' fixture-player--winner';
					fixture.awayPlayerClass = ' fixture-player--loser';
				} else if (fixture.homeScore < fixture.awayScore) {
					fixture.awayPlayerClass = ' fixture-player--winner';
					fixture.homePlayerClass = ' fixture-player--loser';
				}
				switch (fixture.outcome) {
					case 'home_forfeit':
						fixture.awayPlayerClass = ' fixture-player--winner';
						fixture.homePlayerClass = ' fixture-player--loser';
						fixture.noteHtml = `${fixture.awayPlayer.psn} wins by forfeit`;
						break;
					case 'away_forfeit':
						fixture.homePlayerClass = ' fixture-player--winner';
						fixture.awayPlayerClass = ' fixture-player--loser';
						fixture.noteHtml = `${fixture.homePlayer.psn} wins by forfeit`;
						break;
					case 'both_forfeit':
						fixture.noteHtml = 'Both players forfeit and draw';
						break;
					default:
						break;
				}
			} else {
				fixture.showResultButton = true;
			}
			return fixture;
		})
		let weekString = moment(weekOne).add(weekWeek, 'week').format('DD/MM');
		weekString += ' - ';
		weekString += moment(weekOne).add(weekWeek + 1, 'week').format('DD/MM');
		const week = {
			week: weekNum,
			weekString,
			fixtures,
		};
		weeks.push(week);
	}
	return weeks;
};

exports.showFixturesNoButtons = (input) => {
	const groupedInput = _.groupBy(input, item => item.matchWeek);
	const weeks = [];
	for (let weekNum in groupedInput) {
		let weekWeek = parseInt(weekNum);
		if (weekNum >= 9) {
			weekWeek += 2;
		}
		const sortedFixtures = _.sortBy(groupedInput[weekNum], item => item.homePlayer.psn);
		const fixtures = sortedFixtures.map((sfx) => {
			const fixture = sfx;
			fixture.homeScoreHtml = '';
			fixture.homePlayerClass = '';
			fixture.awayScoreHtml = '';
			fixture.awayPlayerClass = '';
			fixture.noteHtml = '';
			if (fixture.hasResult) {
				fixture.homeScoreHtml = `<span class="fixture-score">${fixture.homeScore}</span>`;
				fixture.awayScoreHtml = `<span class="fixture-score">${fixture.awayScore}</span>`;
				if (fixture.homeScore > fixture.awayScore) {
					fixture.homePlayerClass = ' fixture-player--winner';
					fixture.awayPlayerClass = ' fixture-player--loser';
				} else if (fixture.homeScore < fixture.awayScore) {
					fixture.awayPlayerClass = ' fixture-player--winner';
					fixture.homePlayerClass = ' fixture-player--loser';
				}
				switch (fixture.outcome) {
					case 'home_forfeit':
						fixture.awayPlayerClass = ' fixture-player--winner';
						fixture.homePlayerClass = ' fixture-player--loser';
						fixture.noteHtml = `${fixture.awayPlayer.psn} wins by forfeit`;
						break;
					case 'away_forfeit':
						fixture.homePlayerClass = ' fixture-player--winner';
						fixture.awayPlayerClass = ' fixture-player--loser';
						fixture.noteHtml = `${fixture.homePlayer.psn} wins by forfeit`;
						break;
					case 'both_forfeit':
						fixture.noteHtml = 'Both players forfeit and draw';
						break;
					default:
						break;
				}
			}
			return fixture;
		})
		let weekString = moment(weekOne).add(weekWeek, 'week').format('DD/MM');
		weekString += ' - ';
		weekString += moment(weekOne).add(weekWeek + 1, 'week').format('DD/MM');
		const week = {
			week: weekNum,
			weekString,
			fixtures,
		};
		weeks.push(week);
	}
	return weeks;
};
