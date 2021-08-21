const { User } = require('../../models/User');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('config');
const facebookOAuthKey = config.get('facebookOAuthKey');


const strat = new FacebookStrategy({
	clientID: facebookOAuthKey.clientID,
	clientSecret: facebookOAuthKey.clientSecret,
	callbackURL: facebookOAuthKey.callbackURL,
	profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
    passReqToCallback: true
},
(req, accessToken, refreshToken, profile, done) => {
	User.findOne({ email: profile._json.email }).then(user => {
		if (!user) {
			let profileImage = !profile.photos.value ? "http://localhost:3000/user/default.png" : profile.photos.value
			const newUser = new User({
				facebookId: profile.id,
				firstName: profile._json.first_name,
				lastName: profile._json.last_name,
				email: profile._json.email,
				image: profileImage,
				role: 'new-comer',
				date: Date.now()
			});
			newUser.save().then(savedUser => done(null, savedUser)).catch(err => console.log(err));
		} else if (!user.facebookId) {
			User.updateOne({ email: profile._json.email }, {
				facebookId: profile.id
			}).then(() => done(null, user)).catch(err => console.log(err));
		} else if (!user.image) {
			let profileImage = !profile.photos[0].value ? "http://localhost:3000/user/default.png" : profile.photos[0].value
			User.updateOne({ email: profile._json.email }, {
				image: profileImage
			}).then(() => done(null, user)).catch(err => console.log(err));
		} else {
			return done(null, user);
		}
	});
});

module.exports = strat;