const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');

const { Url } = require('../models/Url');
const { User } = require('../models/User');

// api/url/post/referral
// api/url/put/referral
// api/url/get/referral
// api/url/get/admin/referral
// api/url/get/user/referral

// @route       Post /api/url/post/referral
// @desc        Create short URL

router.post('/post/referral', async (req, res) => {
	const uid = req.body.uid;
	const baseUrl = config.get('baseUrl');
	const longUrl = '/register/' + uid;
	// Check base url
	if (!validUrl.isUri(baseUrl)) {
		return res.status(401).json({ success: false, message: 'Invalid base url' });
	}

	// Create url code
	const urlCode = shortid.generate();

	// Check long url
	if (validUrl.isUri(baseUrl + longUrl)) {
		try {
			let url = await Url.findOne({ longUrl });
			if (url) {
				return res.json({ success: true, message: url });
			} else {
				const shortUrl = baseUrl + '/i/' + urlCode;

				url = new Url({
					longUrl,
					shortUrl,
					urlCode,
					date: new Date(),
				});

				await url.save();
				return await User.findOneAndUpdate({ _id: uid }, { referralLink: url.shortUrl }, (err, user) => {
					if (err) return res.status(400).json({ success: false, err });
					return res.status(200).json({ success: true, referralLink: url.shortUrl, message: url });
				});
			}
		} catch (err) {
			console.error(err);
			return res.statue(500).json({ success: false, message: 'Server error' });
		}
	} else {
		return res.status(500).json({ success: false, message: 'Invalid long url' });
	}
});

// @route       Post /api/url/get/referral
// @desc        get short URL from User DB
router.get('/get/referral/:uid', (req, res) => {
	const userId = req.params.uid;
	User.findOne({ _id: userId }, (err, user) => {
		if (err) {
			return res.json({
				success: false,
				message: 'No account found.',
			});
		} else if (user.referralLink) {
			return res.status(200).json({
				success: true,
				referralLink: user.referralLink,
			});
		} else {
			return res.json({
				success: false,
				message: 'No Link found.',
			});
		}
	});
});

router.get('/get/longUrl/:id', async (req, res) => {
	const urlCode = req.params.id;

	Url.findOne({ urlCode: urlCode }, (err, url) => {
		if (err) {
			return res.json({
				success: false,
				message: 'No url found.',
			});
		} else {
			return res.status(200).json({
				success: true,
				longUrl: url.longUrl,
			});
		}
	});
});

module.exports = router;
