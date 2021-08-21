const mongoose = require('mongoose');

const resetSchema = mongoose.Schema({
	email: {
		type: String,
		trim: true,
		unique: 1,
	},
	resetToken: {
		type: String,
		default: '',
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
		index: { expires: 1800 },
	},
});

const Reset = mongoose.model('resets', resetSchema);

module.exports = { Reset };
