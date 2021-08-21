const { User } = require('../models/User');

const fetch = require('node-fetch');
const config = require('config');
const ReCaptchaKey = config.get('ReCaptchaKey');

let auth = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		return res.json({
			isAuth: false,
			error: true,
		});
	}
	//유저가 있으면 인증 ok

	//유저가 없으면 인증 no
};

const validateHuman = async token => {
	const secret = ReCaptchaKey.apikey;

	const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`, {
		method: 'POST',
	});

	const data = await response.json();

	return data.success;
};

const REcaptcha = async (req, res, next) => {
	//요청된 이메일을 데이터베이스에서 찾음.
	const token = req.body.token;
	const human = await validateHuman(token);
	if (!human) {
		return res.json({
			loginSuccess: false,
			message: 'Something went wrong, please try again later!',
		});
	}
	next();
};

module.exports = { auth, REcaptcha };
