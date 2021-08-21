const mongoose = require('mongoose');

const urlSchema = mongoose.Schema({
	urlCode: String,
	longUrl: String,
	shortUrl: String,
	time: { type: Date, default: Date.now },
});

const Url = mongoose.model('Url', urlSchema);

module.exports = { Url };
