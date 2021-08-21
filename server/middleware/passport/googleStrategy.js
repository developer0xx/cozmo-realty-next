const { User } = require('../../models/User');
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const config = require('config');
const googleOAuthKey = config.get('googleOAuthKey');

const strat = new GoogleStrategy({
	clientID: googleOAuthKey.clientID,
	clientSecret: googleOAuthKey.clientSecret,
	callbackURL: googleOAuthKey.callbackURL,
    passReqToCallback: true
},
(req, accessToken, refreshToken, profile, done) => {
	User.findOne({ email: profile._json.email }).then(user => {
		if (!user) {
			let profileImage = !profile._json.picture ? "http://localhost:3000/user/default.png" : profile._json.picture
			const newUser = new User({
				googleId: profile.id,
				firstName: profile._json.given_name,
				lastName: profile._json.family_name,
				email: profile._json.email,
				image: profileImage,
				role: 'new-comer',
				date: Date.now()
			});
			newUser.save().then(savedUser => done(null, savedUser)).catch(err => console.log(err));
		} else if (!user.googleId) {
			User.updateOne({ email: profile._json.email }, {
				googleId: profile.id
			}).then(() => done(null, user)).catch(err => console.log(err));
		} else if (!user.image) {
			let profileImage = !profile._json.picture ? "http://localhost:3000/user/default.png" : profile._json.picture
			User.updateOne({ email: profile._json.email }, {
				image: profileImage
			}).then(() => done(null, user)).catch(err => console.log(err));
		} else {
			return done(null, user);
		}
	});
});

module.exports = strat;