const express = require('express');
const router = express.Router();
const { Claim } = require('../models/Claim');
const { auth } = require('../middleware/auth');
const { mailer } = require('../middleware/mailer');
const { User } = require('../models/User');

router.get('/', auth, async (req, res) => {
    await Claim.find({ authorId: req.user._id }, (err, claims) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
            })
        }
        res.status(200).json({ success: true, claims });
    }).populate('claimers').populate('pocketId')
})

router.put('/update', (req, res) => {
	const {authorId, pocketId, businessId, activeId, buyerId, claimers} = req.body
	const queryObj = {pocketId, businessId, activeId, buyerId};
	Claim.findOneAndUpdate(queryObj, { $set: {
		authorId,
		pocketId, businessId, activeId, buyerId,
	}, $push: { claimers: [claimers] } }, { upsert: true, new: true }, (err, data) => {
		if (err) {
			return res.status(400).json({
                success: false,
                err,
            })
		}
        User.findById(authorId, (err, user) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err,
                })
            }
            const newData = {
                mailType: 'claim',
                authorEmail: user.email,
                leadType: pocketId ? 'pocket-listings' : businessId ? 'business' : activeId ? 'active' : buyerId ? 'buyer' : null,
                pocketId, businessId, activeId, buyerId,
                claimers
            };
            return mailer(req, newData, res);
        })
	})
})

router.put('/approve', auth, async (req, res) => {
    let queryObj = null;

    if (req.user.role.includes('admin')) {
        queryObj = { _id: req.body.id }
    } else {
        queryObj = { _id: req.body.id, author: req.user._id }
    }
    const update = {
        "$set": req.body
    }
    Claim.findOneAndUpdate(queryObj, update, { new: true }, (err, claim) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
            });
        }
        res.status(200).json({ success: true, claim });
    })
})

router.delete('/', (req, res) => {
    let queryObj = null;
    if (req.user.role !== 'admin') {
        queryObj = { _id: { $in: req.body }, author: req.user._id };
    } else {
        queryObj = { _id: { $in: req.body } };
    }
    Claim.find(queryObj, (err, claims) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err: 'No inquiries found',
            });
        }
        console.log(claims)
    });
    Claim.deleteMany(queryObj, (err, claims) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
            });
        }
        res.status(200).json({ success: true, claims });
    });
});
module.exports = router;
