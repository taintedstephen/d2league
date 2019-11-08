function getPoints(letter) {
	if (letter === 'W') {
		return 3;
	} else if (letter === 'L') {
		return 0;
	} else {
		return 1;
	}
}

function getResult(result, player) {
	const myScore = (player === 'home') ? result.homeScore : result.awayScore;
	const theirScore = (player === 'home') ? result.awayScore : result.homeScore;
	const { outcome } = result;
	if (
		myScore > theirScore
		|| (player === 'home' && outcome === 'away_forfeit')
		|| (player === 'away' && outcome === 'home_forfeit')
	) {
		return 'W';
	} else if (
		theirScore > myScore
		|| (player === 'away' && outcome === 'away_forfeit')
		|| (player === 'home' && outcome === 'home_forfeit')
	) {
		return 'L';
	} else {
		return 'D';
	}
}

function playerForm(player, results) {
	const outcomes = [];
	results.forEach((result) => {
		if (
			result.homePlayer.toString() === player._id.toString()
			|| result.awayPlayer.toString() === player._id.toString()
		) {
			if (result.homePlayer.toString() === player._id.toString()) {
				const resLetter = getResult(result, 'home');
				outcomes.push({
					outcome: resLetter,
					matchWeek: result.matchWeek,
				});
			} else {
				const resLetter = getResult(result, 'away');
				outcomes.push({
					outcome: resLetter,
					matchWeek: result.matchWeek,
				});
			}
		}
	});
	outcomes.sort((a, b) => {
		return a.matchWeek > b.matchWeek ? -1 : 1;
	});
	const latestOutcomes = outcomes.slice(0, 5);
	let form = '';
	latestOutcomes.forEach((latestResult) => {
		if (latestResult.outcome === 'W') {
			form += '<span class="form-w">W</span>';
		} else if (latestResult.outcome === 'L') {
			form += '<span class="form-l">L</span>';
		} else {
			form += '<span class="form-d">D</span>';
		}
	});
	return form;
}

exports.playerRow = (player, results) => {
	const data = {
		rank: 0,
		psn: player.psn,
		played: 0,
		won: 0,
		drawn: 0,
		lost: 0,
		kills: 0,
		deaths: 0,
		diff: 0,
		form: playerForm(player, results),
		points: 0,
	};

	results.forEach((result) => {
		if (
			result.homePlayer.toString() === player._id.toString()
			|| result.awayPlayer.toString() === player._id.toString()
		) {
			player.played += 1;
			if (result.homePlayer.toString() === player._id.toString()) {
				data.kills += result.homeScore;
				data.deaths += result.awayScore;
				const resLetter = getResult(result, 'home');
				data.points += getPoints(resLetter);
				if (resLetter === 'W') {
					data.won += 1;
				} else if (resLetter === 'L') {
					data.lost += 1;
				} else {
					data.drawn += 1;
				}
			} else {
				data.kills += result.awayScore;
				data.deaths += result.homeScore;
				const resLetter = getResult(result, 'away');
				data.points += getPoints(resLetter);
				if (resLetter === 'W') {
					data.won += 1;
				} else if (resLetter === 'L') {
					data.lost += 1;
				} else {
					data.drawn += 1;
				}
			}
		}
	});
	data.diff = data.kills - data.deaths;
	return data;
};
