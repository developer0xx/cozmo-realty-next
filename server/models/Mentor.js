const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mentorSchema = mongoose.Schema({
	mentor: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	mentee: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	status: {
		type: String,
		default: 'pending',
	},
	time: {
		type: Date,
		default: Date.now,
	},
});

const Mentor = mongoose.model('mentors', mentorSchema);

module.exports = { Mentor };
