const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('../config/db');
const passport = require('./middleware/passport');
const path = require('path');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const config = require('config');
const cookieEncryptionKey = config.get('cookieEncryptionKey');

connectDB();
app.enable('trust proxy');

app.use(morgan('dev'));

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

//certificates
// cors
/* app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
	res.header('Access-Control-Allow-Credentials', 'true');
	next();
});
 */
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	if ('OPTIONS' == req.method) {
		res.send(200);
	} else {
		next();
	}
});

app.use(cors({
	origin: process.env.CLIENT_URL,
	credentials: true,
	optionsSuccessStatus: 200
}));

app.use(bodyParser.json());
app.use(cookieParser());

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie setup
if (process.env.NODE_ENV === 'production') {
	console.log(process.env.CLIENT_URL)
	app.use(
		cookieSession({
			maxAge: 1209600000, // two weeks in milliseconds
			keys: [cookieEncryptionKey], //
			domain: 'dev.cozmorealty.com',
			secureProxy: true,
			path: '/'
		})
	);
}

if (process.env.NODE_ENV === 'development') {
	app.use(
		cookieSession({
			maxAge: 1209600000, // two weeks in milliseconds
			keys: [cookieEncryptionKey], //
		})
	);
}

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.send('Hello World!'));
// app.use('/api/', require('./routes/index'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reset', require('./routes/reset'));
app.use('/api/mail', require('./routes/mail'));
app.use('/api/url', require('./routes/url'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/mentor', require('./routes/mentor'));
app.use('/api/stripe', require('./routes/stripe'));
app.use('/api/pockets', require('./routes/pockets'));
app.use('/api/claims', require('./routes/claims'));



const port = 5000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});