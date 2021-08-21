const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leadSchema = mongoose.Schema({
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	modified: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	agent: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	additionalNotes: {
		type: String,
	},
	notes: {
		type: String,
	},
	company: {
		type: String,
	},
	appValue: {
		type: Number,
	},
	firstName: { type: String, maxlength: 50 },
	lastName: { type: String, maxlength: 50 },
	email: {
		type: String,
		trim: true,
	},
	images: {
		type: [String],
		default: [],
	},
	phoneNumber: { type: String },
	property: {
		propertyType: {
			type: String,
		},
		streetAddress: {
			type: String,
			trim: true,
		},
		streetNumber: {
			type: String,
			trim: true,
		},
		streetName: {
			type: String,
			trim: true,
		},
		streetAddress2nd: {
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

leadSchema.index({ 'property.location': '2dsphere' });

const Lead = mongoose.model('Lead', leadSchema);

module.exports = { Lead };
