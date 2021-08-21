const Stripe = require('stripe')('sk_test_j6BHs46Da7LzK9Qkg1uJqiKx');
const { User } = require('../models/User');

/*=================== Retrieve or Create new customer =======================*/
exports.RetrieveCustomer = RetrieveCustomer = async (req, cb) => {
	if (!req.body.User || !req.body.User.email) {
		return cb('invailed customer info');
	} // check for user email
	const { firstName, lastName, line1, phone, email, city, country, state, postal_code } = req.body.User;
	await Stripe.customers.retrieve(req.user.strId, async function (err, customer) {
		// retrieve the customer from stripe by strId
		if (customer && customer.id && !customer.deleted) {
			return cb(null, { strId: req.user.strId });
		} // found the customer
		await Stripe.customers.create({ email: email, name: firstName + ' ' + lastName, address: { city, state, postal_code, country, line1 } }, (err, newCustomer) => {
			// did not found the customer in stripe, so it will create new one
			if (err) {
				return cb(err);
			}
			User.findOneAndUpdate({ _id: req.user._id }, { $set: { strId: newCustomer.id } }) // update strId in our db
				.exec((err, user) => {
					req.user.strId = newCustomer.id;
					cb(err, { strId: newCustomer.id });
				});
		});
	});
};

/*=================== Retrieve or Create new Source =======================*/
exports.RetrieveSource = RetrieveSource = async (req, cb) => {
	if (!req.body.token) {
		return cb('invailed payment info');
	}
	await Stripe.tokens.retrieve(req.body.token, async function (err, token) {
		// get token info of the used card
		if (err) {
			return cb(err);
		}
		await cardsList(req, async function (err, cards) {
			// get all a customer cards
			if (err) {
				return cb(err);
			}
			if (cards && cards.data && cards.data.length) {
				let card = cards.data.find(x => x.fingerprint === token.card.fingerprint); // check if the card is already exist
				if (card && card.id) {
					card.existBefore = true;
					return cb(null, card);
				}
			}
			await Stripe.customers.createSource(
				req.user.strId,
				{
					// if card not exist, then create new one
					source: req.body.token,
				},
				cb
			);
		});
	});
};
/*=================== create new Price =======================*/
exports.CreatePrice = CreatePrice = async (req, cb) => {
	await Stripe.prices.create(
		{
			unit_amount: 10000,
			currency: 'usd',
			recurring: { interval: 'month' },
			product: 'prod_Io7MCbKKmAU9gZ',
		},
		cb
	);
};
/*=================== create new Product =======================*/
exports.CreateProduct = CreateProduct = async (req, cb) => {
	const product = await Stripe.products.create(
		{
			name: 'Cozmo Realty Membership',
		},
		cb
	);
};
/*=================== create new subscription =======================*/
exports.CreateSubscription = CreateSubscription = (req, cb) => {
	Stripe.subscriptions.create(
		{
			customer: req.user.strId,
			items: [{ price: 'price_1ICV8aCk41aJTXs7IrRRaoCF' }],
		},
		cb
	);
};
/*=================== Retrieve Invoice =======================*/
exports.RetrieveInvoice = RetrieveInvoice = async (req, cb) => {
	if (!req.body.invoiceID) {
		return cb('invailed invoice id');
	}
	await Stripe.invoices.retrieve(req.body.invoiceID, cb);
};
/*=================== Retrieve charge =======================*/
exports.RetrieveCharge = RetrieveCharge = async (req, cb) => {
	if (!req.body.chargeID) {
		return cb('invailed invoice id');
	}
	await Stripe.charges.retrieve(req.body.chargeID, cb);
};

/*===================  =======================*/
exports.SubscriptionList = SubscriptionList = async (req, cb) => {
	if (!req.user || !req.user.strId) {
		return cb('customer id not available');
	}
	await Stripe.subscriptions.list({ customer: req.user.strId }, cb);
};

/*===================  =======================*/
exports.CustomerHistory = CustomerHistory = async (req, cb) => {
	if (!req.user || !req.user.strId) {
		return cb('customer id not available');
	}
	await Stripe.invoices.list({ customer: req.user.strId }, cb);
};

/*===================  =======================*/
exports.CancelSubscription = CancelSubscription = async (req, cb) => {
	if (!req.body.SubscriptionId) {
		return cb('Subscription id not available');
	}
	await Stripe.subscriptions.del(req.body.SubscriptionId, cb);
};
/*===================  =======================*/
exports.cardsList = cardsList = async (req, cb) => {
	if (!req.user || !req.user.strId) {
		return cb('customer id not available');
	}
	await Stripe.customers.listSources(req.user.strId, { object: 'card' }, cb); // get all customers cards
};

/*===================  =======================*/
exports.deleteCard = deleteCard = async (req, cb) => {
	if (!req.params.id) {
		return cb('card id not available');
	}
	if (!req.user || !req.user.strId) {
		return cb('customer id not available');
	}
	await Stripe.customers.deleteSource(req.user.strId, req.params.id, cb);
};
/*===================  =======================*/

//sub_Io7cbu21cBS7wN
/*===================  =======================*/
/* 
    RetrieveCustomer({user:{strId:'cus_FiIkP725nTGFKg0'}},(err,d)=>{
        if(err){return console.log('======= Create Customer error ===========',err);}
        if(d&&d.id){console.log('======= success =======',d.id)}
    }); 
*/

/*
    RetrieveSource({user:{strId:'cus_FiIkP725nTGFKg'},body:{token:""}},(err,d)=>{
        if(err){return console.log('======= Create Source error ===========',err);}
        if(d&&d.id){console.log('======= success =======',d.id)}
    }); 
*/

/*  CreateProduct({},(err,d)=>{
        if(err){return console.log('======= Create Product error ===========',err);}
        if(d&&d.id){console.log('======= Created Product successfully =======',d.id)}
    }); 
*/
/* CreatePrice({},(err,d)=>{
        if(err){return console.log('======= Create price error ===========',err);}
        if(d&&d.id){console.log('======= Created price successfully =======',d.id)}
    }); 
*/

/*
    CreateSubscription({user:{strId:'cus_FiIkP725nTGFKg'}},(err,d)=>{
        if(err){return console.log('======= Create Subscription error ===========',err);}
        if(d&&d.id){console.log('======= Created Subscription successfully =======',d.id)}
    });
*/

/*
    RetrieveInvoice({body:{invoiceID:'in_1ICAQkJjwQIf8F4tGYXVyFDz'}},(err,d)=>{
        if(err){return console.log('======= Create Subscription error ===========',err);}
        if(d&&d.id){console.log('======= Created Subscription successfully =======',d.id)}
    })

*/

/*SubscriptionList({user:{strId:'cus_FiIkP725nTGFKg0'}},(err,d)=>{
    if(err){return console.log('======= Create Subscription error ===========',err);}
    if(d&&d.id){console.log('======= Created Subscription successfully =======',d.id)}
})*/
