const express = require('express');
const router = express.Router();
const { Mentor } = require('../models/Mentor');
const { auth, REcaptcha } = require('../middleware/auth');

router.get('/get/mentees/:uid', auth, (req, res) => {
	console.log(`============mentor 7=====================`);
	Mentor.findOne({ mentor: req.params.uid }, (err, mentees) => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true, mentees: mentees.mentee });
	})
		.populate('mentee')
		.sort({ time: -1 });
});
module.exports = router;
