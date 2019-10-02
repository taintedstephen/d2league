exports.make = (input) => {
	const players = input.sort(() => Math.random() - 0.5);
	const playerCount = players.length;
	let offset = 1;
	const fixtures = [];
	while (offset < playerCount) {
		for (let player = 0; player < playerCount; player++) {
			const offsetPlayer = (player + offset) % playerCount;
			fixtures.push({
				week: offset,
				homePlayer: players[player],
				awayPlayer: players[offsetPlayer],
			});
		}
		offset += 1;
	}
	return fixtures;
};
