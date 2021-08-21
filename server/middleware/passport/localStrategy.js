const { User } = require('../../models/User')
const LocalStrategy = require('passport-local').Strategy

const strat = new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password'
	},
	(email, password, done) => {
		// Find user by username
		User.findOne({ email: email }, (err, user) => {
			// Check if user exists
			if (err) { return done(err, false, null) }
			if (!user) {
				return done(null, false, {
					loginSuccess: false,
					message: 'The email address or password is incorrect!',
				});
			}
			if (!user.password) {
				return done(null, false, {
					loginSuccess: false,
					message: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.'
				})
			}
			user.comparePassword(password, (err, isMatch) => {
				if (err) { return done(err, false, null) }
				if (!isMatch) {
					return done(null, false, {
						loginSuccess: false,
						message: 'The email address or password is incorrect!',
					});
				}
				const userObj = {
					_id: user._id,
					isAuth: true,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					date: user.date,
					image: user.image,
					role: user.role
				}
				return done(null, userObj);
			});
		});
	}
)

module.exports = strat;