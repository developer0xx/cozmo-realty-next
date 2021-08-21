const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { auth, REcaptcha } = require('../middleware/auth');
const passport = require('../middleware/passport');
const { mailer } = require('../middleware/mailer');
const { Agent } = require('../models/Agent');
const { Mentor } = require('../models/Mentor');

router.post('/register', REcaptcha, (req, res) => {
	let userRequest = req.body;
	userRequest.role = ['customer'];
	const user = new User(userRequest);
	user.save((err, userInfo) => {
		if (err) {
			return res.json({
				success: false,
				err,
			});
		} else {
			return res.status(200).json({
				success: true,
			});
		}
	});
});

router.post('/register/role/mentor', auth, (req, res) => {
	let userInfo = req.body.userFilledData;
	if (!userInfo.role.includes('mentor-pending') && !userInfo.role.includes('mentor')) {
		userInfo.role.push('mentor-pending');
	}
	if (userInfo.role.includes('new-comer')) {
		const index = userInfo.role.indexOf('new-comer');
		if (index > -1) {
			userInfo.role.splice(index, 1);
		}
	}
	User.findOneAndUpdate({ _id: userInfo.id }, { $set: userInfo }, (err, uData) => {
		if (!uData || err) {
			return res.json({
				success: false,
				type: 'db-issue',
				err,
			});
		} else {
			Mentor.findOne({ mentor: userInfo.id }, (err, mentorInfo) => {
				if (err) {
					return res.json({
						success: false,
						type: 'db-issue',
						err,
					});
				} else if (mentorInfo) {
					return res.json({
						success: false,
						type: 'already-applied',
						err,
					});
				} else if (!mentorInfo) {
					const saveMentor = new Mentor({
						...userInfo,
						mentor: userInfo.id,
						status: 'pending',
					});
					saveMentor.save((err, newMentor) => {
						if (err) {
							return res.json({
								success: false,
								type: 'db-issue',
								err,
							});
						}
						const newData = {
							...userInfo,
							...uData._doc,
							mailType: 'new-mentor',
						};
						console.log(`==========================users.js 76========================`, newData);
						return mailer(req, newData, res);
					});
				}
			});
		}
	});
	return;
});

router.post('/register/role/agent', auth, (req, res) => {
	let userInfo = req.body.userFilledData;
	if (!userInfo.role.includes('agent-pending') && !userInfo.role.includes('agent')) {
		userInfo.role.push('agent-pending');
	}
	if (userInfo.role.includes('new-comer')) {
		const index = userInfo.role.indexOf('new-comer');
		if (index > -1) {
			userInfo.role.splice(index, 1);
		}
	}
	User.findOneAndUpdate({ _id: userInfo.id }, { $set: userInfo }, (err, uData) => {
		if (!uData || err) {
			return res.json({
				success: false,
				type: 'db-issue',
				err,
			});
		} else {
			Agent.findOne({ agent: userInfo.id }, (err, agentInfo) => {
				if (err) {
					return res.json({
						success: false,
						type: 'db-issue',
						err,
					});
				} else if (agentInfo) {
					return res.json({
						success: false,
						type: 'already-applied',
						err,
					});
				} else if (!agentInfo) {
					const saveAgent = new Agent({
						...userInfo,
						agent: userInfo.id,
						status: 'pending',
					});
					saveAgent.save((err, newAgent) => {
						if (err) {
							return res.json({
								success: false,
								type: 'db-issue',
								err,
							});
						}
						const newData = {
							...userInfo,
							...uData._doc,
							mailType: 'new-agent',
						};
						return mailer(req, newData, res);
					});
				}
			});
		}
	});
	return;
});

router.put('/register/role/customer', (req, res) => {
	const userInfo = req.body;
	if (!userInfo.role || !userInfo.role.includes('customer')) {
		if (!userInfo.role) {
			userInfo.role = [];
		}
		userInfo.role.push('customer');
	}
	if (userInfo.role.includes('new-comer')) {
		const index = userInfo.role.indexOf('new-comer');
		if (index > -1) {
			userInfo.role.splice(index, 1);
		}
	}
	User.findOneAndUpdate({ _id: userInfo._id }, { role: userInfo.role }, (err, uData) => {
		if (!uData || err) {
			return res.json({
				success: false,
				type: 'db-issue',
				err,
			});
		} else {
			return res.status(200).json({ success: true, message: 'Welcome to Cozmo!' });
		}
	});
	return;
});

router.post('/login', REcaptcha, (req, res, next) => {
	passport.authenticate('local', { session: true }, (err, user, info) => {
		if (err) {
			console.log(err);
			return res.json({
				loginSuccess: false,
				message: 'Something went wrong, please try again later!',
			});
		}
		if (!user) {
			return res.json(info);
		}
		req.logIn(user, err => {
			if (err) {
				console.log(err);
				return res.json({
					loginSuccess: false,
					message: 'Something went wrong, please try again later!',
				});
			}
			res.json({
				loginSuccess: true,
				user,
			});
		});
	})(req, res, next);
});
/* 
router.get('/oAuthLogin/:id', (req, res) => {
	console.log(req.params);
	User.findOne({ _id: req.params.id }, (err, user) => {
		if (err) {
			console.log(err);
			return res.json({
				loginSuccess: false,
				message: 'Something went wrong, please try again later!',
			});
		}
		user.generateToken((err, user) => {
			if (err) return res.status(400).send(err);

			const userObj = {
				_id: user._id,
				isAuth: true,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				date: user.date,
				image: user.image
			}

			return res.json({
				loginSuccess: true,
				user: userObj,
			});
		});
	})
}); */

router.get(
	'/auth/facebook',
	passport.authenticate('facebook', {
		scope: ['email', 'user_photos'],
		enable_profile_selector: true,
	})
);

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: 'http://localhost:3000/login', session: true }), (req, res) => {
	if (req.user) {
		req.logIn(req.user, err => {
			if (err) {
				console.log(err);
				res.redirect('http://localhost:3000/login/');
			}
			if (req.user.role.includes('new-comer')) {
				res.redirect('http://localhost:3000/register/roles');
			} else {
				res.redirect('http://localhost:3000/#');
			}
		});
	} else {
		res.redirect('http://localhost:3000/login/');
	}
});

router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'openid', 'email', 'profile'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login', session: true }), (req, res) => {
	if (req.user) {
		req.logIn(req.user, err => {
			if (err) {
				console.log(err);
				res.redirect('http://localhost:3000/login/');
			}
			if (req.user.role.includes('new-comer')) {
				res.redirect('http://localhost:3000/register/roles/');
			} else {
				res.redirect('http://localhost:3000/');
			}
		});
	} else {
		res.redirect('http://localhost:3000/login/');
	}
});

router.get('/auth', auth, (req, res) => {
	//여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는 말.
	if (req.user) {
		res.status(200).json({
			_id: req.user._id,
			isAuth: true,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			email: req.user.email,
			phoneNumber: {
				textmask: req.user.phoneNumber || '(   )    -    ',
				numberformat: '1320',
			},
			streetAddress: req.user.streetAddress,
			streetAddress2nd: req.user.streetAddress2nd,
			city: req.user.city,
			state: req.user.state,
			zip: req.user.zip,
			country: req.user.country,
			role: req.user.role,
			referralLink: req.user.referralLink,
			image: req.user.image,
		});
	} else {
		res.status(400).json({
			isAuth: false,
		});
	}
});

router.get('/logout', auth, (req, res) => {
	User.findOneAndUpdate(
		{ _id: req.user._id },
		{
			token: '',
		},
		(err, user) => {
			{
				if (err) return res.status(400).json({ success: false, err });
				req.logout();
				return res.status(200).json({
					success: true,
				});
			}
		}
	);
});

router.get('/get/users/:role', (req, res) => {
	const temp = req.params.role !== 'undefined' ? { role: { $in: req.params.role } } : null;
	User.find(temp, (err, users) => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true, users });
	}).sort({ time: -1 });
});

router.get('/dashboard/user/user/', auth, (req, res) => {
	User.findOne({ _id: uid }, (err, user) => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true, user });
	});
});

router.get('/dashboard/my-account/:uid', (req, res) => {
	let tmpObj = {};
	User.findOne({ _id: req.params.uid }, (err, user) => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		tmpObj = { ...user._doc };
		delete tmpObj.token;
		delete tmpObj.password;
		res.status(200).json({ success: true, user: tmpObj });
	});
});

// Delete user account
router.put('/put/delete/:uid', auth, (req, res) => {
	User.deleteOne({ _id: req.params.uid }, (err, user) => {
		if (err) {
			return res.status(400).json({
				success: false,
			});
		} else {
			return res.status(200).json({ success: true });
		}
	});
});

// Update user info and password
router.put('/update', auth, (req, res) => {
	if (req.body.password) {
		User.findOne({ email: req.body.email }, (err, user) => {
			if (!user || err) {
				return res.json({
					success: false,
					message: 'No account found.',
				});
			} else {
				user.encryptPassword(req.body.password, (err, hash) => {
					if (err) {
						return res.json({
							success: false,
							err,
						});
					} else {
						const newUser = { ...req.body, password: hash };
						User.findOneAndUpdate({ _id: req.body._id }, { $set: newUser }, (err, user) => {
							if (!user) {
								return res.json({
									success: false,
									message: 'No account found.',
								});
							} else {
								return res.status(200).json({
									success: true,
								});
							}
						});
					}
				});
			}
		});
	} else {
		User.findOneAndUpdate({ _id: req.body._id }, { $set: req.body }, (err, user) => {
			if (!user || err) {
				return res.json({
					success: false,
					err,
				});
			} else {
				return res.status(200).json({
					success: true,
				});
			}
		});
	}
});

//Reset Password
router.put('/resetPassword', (req, res) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user || err) {
			return res.json({
				success: false,
				message: 'No account found.',
			});
		} else {
			user.encryptPassword(req.body.password, (err, hash) => {
				if (err) {
					return res.json({
						success: false,
						err,
					});
				} else {
					user.updateOne({ password: hash }, (err, response) => {
						if (!response || err) {
							return res.json({
								success: false,
								message: err ? err : 'No account found.',
							});
						} else {
							return res.status(200).json({
								success: true,
							});
						}
					});
				}
			});
		}
	});
});

router.get('/get/agent/:uid', auth, (req, res) => {
	Agent.findOne({ agent: req.params.uid }, (err, agent) => {
		if (err) {
			return res.status(400).json({
				success: false,
				err,
			});
		}
		res.status(200).json({ success: true, agent });
	}).populate('agent');
});

module.exports = router;
