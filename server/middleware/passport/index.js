const passport = require('passport');
const LocalStrategy = require('./localStrategy'),
	  GoogleStrategy = require("./googleStrategy");
	  FacebookStrategy = require("./facebookStrategy");
const { User } = require("../../models/User");

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	User.findOne(
		{ _id: id },
		(err, user) => {
			if (err) {
				console.log(err);
			}
			done(null, user);
		}
	)
});

passport.use('local', LocalStrategy);
passport.use('google', GoogleStrategy);
passport.use('facebook', FacebookStrategy);

module.exports = passport;