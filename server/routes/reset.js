const express = require('express');
const router = express.Router();
const { Reset } = require('../models/Reset');
const { User } = require('../models/User');

const crypto = require('crypto');
const { mailer } = require('../middleware/mailer');

router.post('/forgotpassword', (req, res) => {
	console.log('======================forgotpassword==================');
	const beforeHash = new Date().toString() + req.body.email;
	const hashed = crypto.createHash('sha1').update(beforeHash).digest('hex');
	const reset = new Reset({
		email: req.body.email,
		resetToken: hashed,
	});
	User.findOne({ email: reset.email }, (err, user) => {
		console.log('======================18==================');
		if (err) {
			return res.json({
				success: false,
				message: err,
			});
		}
		if (user) {
			Reset.findOne({ email: user.email }, (err, resetUser) => {
				console.log('======================27==================');

				console.log(resetUser);
				if (err) {
					return res.json({
						success: false,
						message: err,
					});
				}
				if (resetUser) {
					Reset.updateOne(resetUser, { $set: { resetToken: hashed } }, (error, response) => {
						console.log('======================38==================');

						if (error) {
							console.log('================41=================');
							return res.json({
								success: false,
								message: error,
							});
						} else {
							console.log('================47=================');
							const tmpObj = { resetToken: hashed, email: user.email, mailType: 'reset' };
							return mailer(req, tmpObj, res);
						}
					});
				} else {
					reset.save((error, response) => {
						console.log('======================52==================');

						if (error) {
							return res.json({
								success: false,
								message: error,
							});
						} else {
							const tmpObj = { resetToken: hashed, email: user.email, mailType: 'reset' };
							return mailer(req, tmpObj, res);
						}
					});
				}
			});
		} else {
			return res.json({
				success: false,
				message: 'User not found on Database',
			});
		}
	});
});

// @route       /api/reset/get/email/:token
// @desc        get user's email

router.get('/get/email/:token', (req, res) => {
	Reset.findOne({ resetToken: req.params.token }, (err, user) => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true, user });
	});
});
module.exports = router;
