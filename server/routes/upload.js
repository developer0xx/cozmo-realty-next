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

router.post('/:pageName/:id', (req, res) => {
	const { pageName, id } = req.params;

	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, `client/public/${pageName}/`);
		},
		filename: (req, file, cb) => {
			const ext = path.extname(file.originalname);
			cb(null, `${Date.now()}__${id}${ext}`);
		},
		fileFilter: (req, file, cb) => {
			const ext = path.extname(file.originalname);
			if (ext !== '.jpg' || ext !== '.png' || ext !== '.jpeg') {
				return cb(res.status(400).end('only jpg, png are allowed'), false);
			}
			cb(null, true);
		},
	});

	const upload = multer({ storage: storage }).array('files');

	const updateLead = (currModal, imgsArray) => {
		return currModal.findOneAndUpdate({ _id: id }, { $push: { images: [...imgsArray] } }, { upsert: true, new: true }, (err, result) => {
			if (!result || err) {
				return res.json({
					success: false,
					err,
					uploaded: true,
				});
			} else {
				return res.status(200).json({
					success: true,
					data: result,
					uploaded: true,
				});
			}
		});
	}

	upload(req, res, err => {
		if (err instanceof multer.MulterError) {
			return res.json({ success: false, err });
		}
		if (res.req.files) {
			let imgsArray = [];
			res.req.files.map(singleFile => {
				imgsArray.push(singleFile.path.replace('client/public', ''));
			});

			// Add more modals based on which page the info is coming from.

			if (pageName === 'leads') {
				updateLead(Lead, imgsArray);
			}
			/* 
			else if (pageName === 'user') {
				updateLead(User, imgsArray);
			} 
			*/
			else {
				return res.status(200).json({
					success: true,
					uploaded: false,
				});
			}

		} else {
			return res.status(200).json({
				success: true,
				uploaded: false,
			});
		}
	});
});

router.put('/put/images/', auth, (req, res) => {
	console.log("==================routes/upload:93=================\n");
	const imagePaths = req.body;
	console.log(__dirname);
	imagePaths.map(imgPath => unlinkSync(__dirname + '/../../client/public' + imgPath));
	Lead.findOneAndUpdate({ images: { $in: imagePaths } }, { $pullAll: { images: imagePaths } }, { new: true }, (err, property) => {
		if (!property || err) {
			return res.json({
				success: false,
				err,
				uploaded: true,
			});
		} else {
			return res.status(200).json({
				success: true,
				property,
				uploaded: true,
			});
		}
	});
});

module.exports = router;