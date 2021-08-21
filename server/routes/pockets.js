const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Pocket } = require('../models/Pocket');
const geocoder = require('../middleware/geocoder');

router.get('/dashboard/admin', (req, res) => {
    if (req.user.role.includes('admin')) {
        Pocket.find((err, pockets) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err,
                });
            }
            res.status(200).json({ success: true, pockets });
        })
    } else {
        return res.status(400).json({
            success: false,
            err,
        });
    }
})

router.get('/dashboard/agent', (req, res) => {
    Pocket.find({ author: req.user._id }, (err, pockets) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
            });
        }
        res.status(200).json({ success: true, pockets });
    })
})

router.get('/', (req, res) => {
    const search = req.query;
    let searchLimit = null;
    if (search.limit && search.page === 'home') {
        searchLimit = +search.limit;
    }
    Pocket.find(/* { $or: [{ status: 'verified' }, { status: 'completed' }] } */)
        .limit(searchLimit)
        .populate('author')
        .sort({ time: -1 })
        .exec((err, countTotal) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    success: false,
                    err,
                });
            }
            if (Object.keys(search).length === 0 || search.requested === 'false') {
                return res.status(200).json({ success: true, currentProperties: countTotal, nearbyProperties: null, postSize: countTotal.length, totalCount: countTotal.length });
            } else {
                let city = '';
                let queryObj = {
                };
                console.log(search)
                if (search) {
                    if (search.purpose) {
                        queryObj = {
                            ...queryObj,
                            purpose: search.purpose,
                        };
                    }
                    if (search.propertyType) {
                        queryObj = {
                            ...queryObj,
                            propertyType: search.propertyType,
                        };
                    }
                    if (search.city) {
                        city = search.city.toLowerCase();
                        queryObj = {
                            ...queryObj,
                            'property.city': { $regex: new RegExp(city, "i") },
                        };
                    }/* 
					if (+search.minPrice > 0) {
						queryObj = {
							...queryObj,
							loanAmt: { $gte: +search.minPrice },
						};
					}
					if (+search.maxPrice > 0) {
						queryObj = {
							...queryObj,
							loanAmt: { $lte: +search.maxPrice, ...queryObj.loanAmt },
						};
					} */
                }
                console.log(queryObj);
                Pocket.find({ ...queryObj })
                    .populate('author')
                    .sort({ time: -1 })
                    .exec((err, properties) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).json({
                                success: false,
                                err,
                            });
                        }
                        return res.status(200).json({
                            success: true,
                            currentProperties: properties,
                            nearbyProperties: null,
                            postSize: properties.length ? properties.length : 'empty',
                            totalCount: countTotal.length,
                        });
                    });
            }
        });
})

router.get('/cities', (req, res) => {
    Pocket.find({}, { "property.city": 1 }, (err, cities) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                err,
            });
        }
        let cityList = [];
        cities.forEach(({ property: { city } }) => {
            if (!cityList.includes(city)) {
                cityList = [...cityList, city];
            }
        })
        return res.status(200).json({
            success: true,
            cityList: cityList
        })
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Pocket.findOne({ _id: id }, (err, pocket) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
            });
        }
        res.status(200).json({ success: true, pocket });
    })
})

// Single Lead page get all except current lead
router.get('/other/:id', (req, res) => {
	Pocket.find({ _id: { $ne: req.params.id }, status: 'verified' }, (err, leads) => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true, leads });
	}).limit(4);
});

router.post('/', (req, res) => {
    const pocket = new Pocket({ ...req.body, author: req.user._id })
    pocket.save((err, data) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ success: false, err });
        }

        return res.status(200).json({ success: true, id: data._doc._id, message: 'Lead uploaded successfully.' });
    });
})

const saveGeocode = async (data, id) => {
    const address = await geocoder.geocode(`
    ${data.property.line1}
    ${data.property.country} ${data.property.zip}`);
    const propertyLocation = { type: 'Point', coordinates: [address[0].longitude, address[0].latitude] };
    let newPocket = data;
    newPocket.property.location = propertyLocation;
    Pocket.findOneAndUpdate({ _id: id }, newPocket, { new: true }, (err, pocket) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
            });
        }
        console.log('Newpocket:', pocket)
        return ({ success: true, pocket });

    })
}

router.put('/', (req, res) => {
    let queryObj = null;

    if (req.user.role.includes('admin')) {
        queryObj = { _id: req.body.id }
    } else {
        queryObj = { _id: req.body.id, author: req.user._id }
    }
    const update = {
        "$set": req.body
    }
    Pocket.findOneAndUpdate(queryObj, update, { new: true }, (err, pocket) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
            });
        }
        if (!pocket.property.location.length) {
            saveGeocode(pocket, req.body.id)
        }

        res.status(200).json({ success: true, pocket });
        // pocket.save((err, data) => {
        //     if (err) {
        //         console.log(err)
        //         return res.status(400).json({ success: false, err });
        //     }

        //     return res.status(200).json({ success: true, id: data._doc._id, message: 'Lead uploaded successfully.' });
        // });
    })
})

router.delete('/', (req, res) => {
    let queryObj = null;
    if (req.user.role !== 'admin') {
        queryObj = { _id: { $in: req.body }, author: req.user._id };
    } else {
        queryObj = { _id: { $in: req.body } };
    }
    Pocket.find(queryObj, (err, pockets) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err: 'No inquiries found',
            });
        }
        console.log(pockets)
    });
    Pocket.deleteMany(queryObj, (err, pockets) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err,
            });
        }
        res.status(200).json({ success: true, pockets });
    });
});
module.exports = router;
