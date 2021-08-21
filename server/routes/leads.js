const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { Lead } = require('../models/Lead');
const { auth } = require('../middleware/auth');
const { mailer } = require('../middleware/mailer');
const { ObjectId } = require('mongodb'); // or ObjectID Not Working
const multer = require('multer');
const { promisify } = require('util');
const geocoder = require('../middleware/geocoder');
const sanitizeHtml = require('sanitize-html');

const unlinkSync = promisify(fs.unlinkSync);

router.post('/create', auth, (req, res) => {
	//save all the data we got from the client into the DB
	const leadObj = {
		...req.body,
		notes: sanitizeHtml(req.body.notes),
		appValue: req.body.appValue.split('.')[0].replace(/\D/g, ''),
	};
	delete leadObj.token;
	const lead = new Lead(leadObj);
	lead.save((err, data) => {
		if (err) return res.status(400).json({ success: false, err });
		return res.status(200).json({ success: true, id: data._doc._id, message: 'Lead uploaded successfully.' });
	});
});

router.put('/update', auth, (req, res) => {
	const newTime = Date.now();
	const leadObj = {
		...req.body,
		notes: sanitizeHtml(req.body.notes),
		appValue: typeof req.body.appValue === 'string' ? req.body.appValue.split('.')[0].replace(/\D/g, '') : req.body.appValue,
		time: new Date(newTime),
	};
	Lead.findOneAndUpdate({ _id: req.body._id }, { $set: leadObj }, { new: true }, (err, lead) => {
		if (!lead || err) {
			console.log(err);
			return res.json({
				success: false,
				err,
			});
		} else {
			return res.status(200).json({
				success: true,
				data: lead,
			});
		}
	});
});

// landing page get all leads
router.get('/get/all', (req, res) => {
	Lead.find({ status: 'verified' }, (err, leads) => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true, leads });
	});
});

// landing page get a lead
router.get('/get/:id', (req, res) => {
	const id = req.params.id;
	console.log(id);
	Lead.findOne({ _id: id }, (err, leads) => {
		console.log("DB GET : ", leads)
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true, leads });
	});
});

// Single Lead page get all except current lead
router.get('/get/other/:id', (req, res) => {
	Lead.find({ _id: { $ne: req.params.id }, status: 'verified' }, (err, leads) => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true, leads });
	}).limit(4);
});

router.put('/update/agent', auth, (req, res) => {
	Lead.findByIdAndUpdate(req.body.lead_id, { agent: req.body.uid, status: 'taken' }, (err, lead) => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true, lead });
	});
});

router.get('/coldcaller/get/all/:uid', (req, res) => {
	Lead.find({ author: req.params.uid }, (err, leads) => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true, leads });
	}).sort({ time: -1 });
});

router.delete('/coldcaller/delete/leads', (req, res) => {
	Lead.deleteMany({ _id: { $in: req.body.list } }, err => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true });
	});
});

router.get('/agent/get/all/:uid', (req, res) => {
	Lead.find({ agent: req.params.uid }, (err, leads) => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true, leads });
	}).sort({ time: -1 });
});

router.put('/release/leads', auth, async (req, res) => {
	let newLeads = {};
	await Lead.find({ _id: { $in: req.body.list } }, (err, leads) => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		newLeads = leads.map(lead => {
			return { ...lead._doc, status: 'verified', agent: null };
		});
	});

	await Lead.deleteMany({ _id: { $in: req.body.list } });
	await Lead.insertMany(newLeads);
	res.status(200).json({ success: true });
});

router.get('/admin/get/all/', (req, res) => {
	Lead.find((err, leads) => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true, leads });
	}).sort({ time: -1 });
});

router.delete('/admin/delete/leads', auth, async (req, res) => {
	await Lead.deleteMany({ _id: { $in: req.body.list } }, err => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true });
	});
});

module.exports = router;
