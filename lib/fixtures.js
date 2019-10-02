const _ = require('underscore');

exports.makeFixtures = (input) => {
	const players = input.sort(() => Math.random() - 0.5);
	const playerCount = players.length;
	let offset = 1;
	const weeks = [];
	while (offset < playerCount) {
		const weekFixtures = [];
		for (let player = 0; player < playerCount; player++) {
			const offsetPlayer = (player + offset) % playerCount;
			weekFixtures.push({
				homePlayer: players[player],
				awayPlayer: players[offsetPlayer],
			});
		}
		const fixtures = _.sortBy(weekFixtures, item => item.homePlayer.psn);
		weeks.push({
			week: offset,
			fixtures,
		});
		offset += 1;
	}
	return weeks;
};

exports.showFixtures = (input) => {
	const groupedInput = _.groupBy(input, item => item.matchWeek);
	const weeks = [];
	for (let weekNum in groupedInput) {
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
		const week = {
			week: weekNum,
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
		const week = {
			week: weekNum,
			fixtures,
		};
		weeks.push(week);
	}
	return weeks;
};
