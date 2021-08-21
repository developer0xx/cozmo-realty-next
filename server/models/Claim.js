const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const claimSchema = mongoose.Schema({
	authorId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	pocketId: {
		type: Schema.Types.ObjectId,
		ref: 'Pocket',
	},
	businessId: {
		type: Schema.Types.ObjectId,
		ref: 'Business',
	},
	activeId: {
		type: Schema.Types.ObjectId,
		ref: 'Active',
	},
	buyerId: {
		type: Schema.Types.ObjectId,
		ref: 'Buyer',
	},
	claimers: [
		{
			uid: {
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
			firstName: {
				type: String,
				trim: true,
			},
			lastName: {
				type: String,
				trim: true,
			},
			phoneNumber: {
				type: String,
				trim: true,
			},
			email: {
				type: String,
				trim: true,
			},
			message: {
				type: String
			},
			NDA: {
				type: Boolean,
				require: true,
				default: false
			}
		}
	]
});

const Claim = mongoose.model('Claim', claimSchema);

module.exports = { Claim };
