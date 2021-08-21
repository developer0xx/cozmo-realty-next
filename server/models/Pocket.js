const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pocketSchema = mongoose.Schema({

	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	firstName: { type: String, maxlength: 50 },
	lastName: { type: String, maxlength: 50 },
	email: {
		type: String,
		trim: true,
	},
	propertyType: {
		type: String,
	},
	propertySubType: {
		type: String,
	},
	purpose: {
		type: String,
	},
	askingPrice: {
		type: Number,
	},
	lotSize: {
		type: String,
		trim: true
	},
	buildingSize: {
		type: String,
		trim: true
	},
	phoneNumber: { type: String },
	property: {
		line1: {
			type: String,
			trim: true,
		},
		line2: {
			type: String,
			trim: true,
		},
		city: { type: String },
		state: { type: String },
		zip: { type: Number },
		country: { type: String },
		location: {
			type: {
				type: String,
				enum: ['Point'],
			},
			coordinates: {
				type: [Number],
			},
		},
		submarket: { type: String },
	},
	views: {
		type: Number,
		default: 0,
	},
	status: {
		type: String,
	},
	dateCalled: {
		type: String,
	},
	time: {
		type: Date,
		default: Date.now,
	},
});

pocketSchema.index({ 'property.location': '2dsphere' });

const Pocket = mongoose.model('Pocket', pocketSchema);

module.exports = { Pocket };
