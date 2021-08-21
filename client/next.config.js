module.exports = {
	publicRuntimeConfig: {
		NODE: process.env.NODE,
		APP_NAME: process.env.APP_NAME,
		API_DEVELOPMENT: process.env.API_DEVELOPMENT,
		API_PRODUCTION: process.env.API_PRODUCTION,
		REACT_APP_GOOGLE_MAP_API_KEY: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
		REACT_APP_MAILCHIMP_URL: process.env.REACT_APP_MAILCHIMP_URL,
		REACT_APP_TINY_MCE_API_KEY: process.env.REACT_APP_TINY_MCE_API_KEY,
		REACT_APP_RECAPTCHA_KEY: process.env.REACT_APP_RECAPTCHA_KEY,
	},
	webpack(config, { dev }) {
		if (dev) {
			config.devtool = 'cheap-module-source-map';
		}
		return config;
	},
	images: {
		domains: [
			'localhost',
			'storage.googleapis.com',
			'lh1.googleusercontent.com',
			'lh2.googleusercontent.com',
			'lh3.googleusercontent.com',
			'lh4.googleusercontent.com',
			'lh5.googleusercontent.com',
			'lh6.googleusercontent.com',
			'platform-lookaside.fbsbx.com',
		],
	},
	/* async headers() {
		return [
			{
				// matching all API routes
				source: "/api/:path*",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{ key: "Access-Control-Allow-Origin", value: "*" },
					{ key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
					{ key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
				]
			}
		]
	} */
};
