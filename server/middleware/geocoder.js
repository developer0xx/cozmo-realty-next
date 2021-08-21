const NodeGeocoder = require('node-geocoder');
const config = require('config');
const geocoderKey = config.get('geoCoderKey');

const options = {
	provider: 'google',
	httpAdapter: 'https',
	apiKey: geocoderKey.apiKey,
	formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
