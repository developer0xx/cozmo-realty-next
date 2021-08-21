const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = mongoose.Schema({
	uid: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	order_id: {
		type: String,
	},
	time: {
		type: Date,
		default: Date.now,
	},
});

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };
