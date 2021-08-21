const { RetrieveCustomer, RetrieveSource, CreateSubscription, RetrieveInvoice, SubscriptionList, cardsList, deleteCard } = require('./stripe.helper');

/*===================  =======================*/
exports.Subscribe = async (req, res) => {
	if (!req.body.token) {
		return res.json({ success: false, message: 'invailed payment info' });
	}
	RetrieveCustomer(req, (err, d) => {
		if (err) {
			return res.json({ success: false, message: err });
		}
		RetrieveSource(req, (err, d) => {
			console.log('==CreateSubscription==', err, d);
			if (err) {
				return res.json({ success: false, message: err });
			}
			CreateSubscription(req, (err, d) => {
				if (err) {
					return res.json({ success: false, message: err });
				}
				res.json({ success: true, message: 'you have successfully subscribed', invoiceId: d.latest_invoice });
			});
		});
	});
};

/*===================  =======================*/
exports.getInvoice = async (req, res) => {
	RetrieveInvoice(req, (err, invoice) => {
		if (err) {
			return res.json({ success: false, message: err });
		}
		RetrieveCharge({ body: { chargeID: invoice.charge } }, (err, charge) => {
			if (err) {
				return res.json({ success: false, message: err });
			}
			invoice.charge = charge;
			//  console.log(invoice)
			res.json({ success: true, invoice });
		});
	});
};
/*===================  =======================*/

exports.OneTimePay = async (req, res) => {
	const { email } = req.body;
	const paymentIntent = await Stripe.paymentIntents.create({
		amount: 99999999,
		currency: 'usd',
		// Verify your integration in this guide by including this parameter
		metadata: { integration_check: 'accept_a_payment' },
		receipt_email: email,
	});
	res.json({ client_secret: paymentIntent['client_secret'] });
};

/*===================  =======================*/

exports.getSubscriptionList = async (req, res) => {
	SubscriptionList(req, (err, d) => {
		if (err) {
			res.json({ success: false, message: err });
		}
		if (d) {
			res.json({ success: true, list: d.data });
		}
	});
};

/*===================  =======================*/

exports.getCustomerHistory = async (req, res) => {
	CustomerHistory(req, (err, d) => {
		if (err) {
			res.json({ success: false, message: err });
		}
		if (d) {
			res.json({ success: true, list: d.data });
		}
	});
};
/*===================  =======================*/

exports.CancelSubscription = async (req, res) => {
	CancelSubscription(req, (err, d) => {
		if (err) {
			res.json({ success: false, message: err });
		}
		if (d) {
			res.json({ success: true, message: 'Subscription Canceled successfully' });
		}
	});
};
/*===================  =======================*/

exports.cardsList = async (req, res) => {
	console.log('======cardsList=======');
	cardsList(req, async function (err, d) {
		if (err) {
			res.json({ success: false, message: err });
		}
		if (d) {
			res.json({ success: true, list: d.data });
		}
	});
};
/*===================  =======================*/

exports.addCard = async (req, res) => {
	console.log('======addCard=======');
	RetrieveSource(req, (err, card) => {
		if (err) {
			res.json({ success: false, message: err });
		}
		if (card) {
			res.json({ success: true, card: card, message: 'card added successfully' });
		}
	});
};
/*===================  =======================*/

exports.deleteCard = async (req, res) => {
	console.log('======deleteCard=======');
	deleteCard(req, (err, d) => {
		if (err) {
			res.json({ success: false, message: err });
		}
		if (d) {
			res.json({ success: true, message: 'card deleted successfully' });
		}
	});
};
