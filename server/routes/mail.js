const express = require('express');
const router = express.Router();
const { mailer } = require('../middleware/mailer');

const fetch = require('node-fetch');
const config = require('config');
const ReCaptchaKey = config.get('ReCaptchaKey');

const validateHuman = async (token) => {
	const secret = ReCaptchaKey.apikey;

	const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
	{
		method: 'POST'
	});

	const data = await response.json();

	return data.success;

}

router.post('/contact', async (req, res) => {
	console.log('request taken');
	const token = req.body.token;
	const human = await validateHuman(token);
	if (!human) {
		return res.json({
			success: false,
			err: 'Something went wrong, please try again later!'
		})
	}
	const newData = {
		mailType: 'contact',
	};
	return mailer(req, newData, res);
});

router.post('/invest', async (req, res) => {
	const token = req.body.token;
	const human = await validateHuman(token);
	if (!human) {
		return res.json({
			success: false,
			err: 'Something went wrong, please try again later!'
		})
	}
	const newData = {
		mailType: 'invest',
	};
	return mailer(req, newData, res);
});

module.exports = router;
