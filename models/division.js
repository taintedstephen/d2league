const mongoose = require('mongoose');

const DivisionSchema = mongoose.Schema({
	name: {
		type: String,
	},
	sortOrder: {
		type: Number,
	},
	players: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Player',
	}]
});

const Division = mongoose.model('Division', DivisionSchema);
module.exports = Division;
