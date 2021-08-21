const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { Schema } = require('mongoose');

const userSchema = new Schema({
	firstName: {
		type: String,
		maxlength: 50,
	},
	lastName: {
		type: String,
		maxlength: 50,
	},
	email: {
		type: String,
		trim: true,
		unique: 1,
	},
	password: {
		type: String,
		minlength: 5,
	},
	phoneNumber: {
		type: String,
	},
	streetAddress: {
		type: String,
	},
	streetAddress2nd: {
		type: String,
	},
	city: {
		type: String,
	},
	state: {
		type: String,
	},
	zip: {
		type: Number,
	},
	country: {
		type: String,
	},
	subscribe: {
		type: Boolean,
	},
	role: {
		type: [String],
		default: ['new-comer']
	},
	time: {
		type: Date,
		default: Date.now,
	},
	googleId: {
		type: String,
	},
	facebookId: {
		type: String,
	},
	referralLink: {
		type: String,
	},
	image: {
		type: [String],
		default: ['/profile.png'],
	},
	token: {
		type: String,
	},
	tokenExp: {
		type: Number,
	},
	strId:{
		type: String,
	}
});

userSchema.methods.encryptPassword = function (plainPassword, cb) {
	bcrypt.genSalt(saltRounds, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash(plainPassword, salt, function (err, hash) {
			if (err) return next(err);
			cb(null, hash);
		});
	});
};

// Register User
userSchema.pre('save', function (next) {
	var user = this;
	if (user.isModified('password')) {
		//bcrypt password
		bcrypt.genSalt(saltRounds, function (err, salt) {
			if (err) return next(err);
			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) return next(err);
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
	bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

userSchema.methods.generateToken = function (cb) {
	var user = this;

	// jsonwebtoken을 이용해서 token을 생성하기
	var token = jwt.sign(user._id.toHexString(), 'secretToken');
	// user._id + 'secretToken' = token
	// ->
	// 'secretToken' -> user._id

	user.token = token;
	user.save(function (err, user) {
		if (err) return cb(err);
		cb(null, user);
	});
};

userSchema.statics.findByToken = function (token, cb) {
	var user = this;

	//token decode
	jwt.verify(token, 'secretToken', function (err, decoded) {
		//유저 아이디를 이용해서 유저를 찾은 다음에 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
		user.findOne(
			{
				_id: decoded,
				token: token,
			},
			function (err, user) {
				if (err) return cb(err);
				cb(null, user);
			}
		);
	});
};

userSchema.methods.generateResetToken = function (cb) {
	var user = this;

	// jsonwebtoken을 이용해서 token을 생성하기
	var token = jwt.sign(user._id.toHexString(), 'secretToken');
	// user._id + 'secretToken' = token
	// ->
	// 'secretToken' -> user._id

	user.resetToken = token;
	user.save(function (err, user) {
		if (err) return cb(err);
		cb(null, user);
	});
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
