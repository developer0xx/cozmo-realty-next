const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentSchema = mongoose.Schema({
	agent: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	dreNum: {
		type: String,
	},
	agentSince: {
		type: Number,
	},
	allTransactions: {
		type: Number,
	},
	status: {
		type: String,
	},
	time: {
		type: Date,
		default: Date.now,
	},
});

const Agent = mongoose.model('agents', agentSchema);

module.exports = { Agent };
