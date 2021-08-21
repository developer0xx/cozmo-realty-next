const express = require('express');
const router = express.Router();
const path = require('path');
const Stripe = require('stripe')('sk_test_j6BHs46Da7LzK9Qkg1uJqiKx');
const { auth } = require('../middleware/auth');
const { OneTimePay, Subscribe, getInvoice, getSubscriptionList,
	 getCustomerHistory, CancelSubscription,cardsList,addCard, deleteCard} = require('../controller/stripe');

const { Order } = require('../models/Order');

// one time pay
router.post('/pay', auth, OneTimePay);

// subscribe to monthly fee
router.post('/subscribe', auth, Subscribe);

// get getInvoice details
router.post('/invoice', auth, getInvoice);

// get subscriptions List of a customer
router.get('/subscriptionsList', auth, getSubscriptionList);

// get a customer history
router.get('/customerHistory', auth, getCustomerHistory);

// Cancel Subscription
router.put('/CancelSubscription', auth, CancelSubscription);


// get a customer cards 
router.get('/cardsList', auth, cardsList);

// add card
router.post('/card', auth, addCard);

// delete card
router.delete('/card/:id', auth, deleteCard);


router.post('/order', auth, (req, res) => {
	const { uid, order_id } = req.body;

	const order = new Order({
		uid: uid,
		order_id: order_id,
	});

	order.save((err, data) => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true, data });
	});
});

router.get('/:uid', auth, (req, res) => {
	const uid = req.params.uid;
	console.log('stripe.js---------------68', uid);

	Order.findOne({ uid: uid }, (err, data) => {
		if (err) {
			return res.json({
				success: false,
				message: 'No subscription found',
			});
		} else {
			return res.status(200).json({
				success: true,
				order_id: data.order_id,
			});
		}
	});
});

router.get('/order/:order_id', auth, async (req, res) => {
	const { order_id } = req.params;
	console.log('stripe.js---------------68', order_id);

	// const subscription = await stripe.subscriptions.retrieve(order_id);
	const subscription = await stripe.subscriptions.retrieve('sub_IkpjQS81TtQYFO');
	return res.status(200).json({
		success: true,
		orderInfo: subscription,
	});
});
module.exports = router;
