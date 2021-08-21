import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { API } from '../../config';
/* Material UI */
// import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { REACT_APP_RECAPTCHA_KEY } from '../../config';
import Input from '@material-ui/core/Input';
import MaskedInput from 'react-text-mask';
import Router from 'next/router';

// Stripe
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';

const useStyles = makeStyles(theme => ({
	giveMarginTop: {
		marginTop: '8px',
	},
	orderMargin: {
		marginTop: '30px',
	},
	orderSubTitle: {
		fontWeight: '500',
		fontSize: '14px',
	},
	orderPrice: {
		fontWeight: '400',
		fontSize: '14px',
	},
	inputNumber: {
		marginTop: '8px',
		marginBottom: '8px',
		borderRadius: 4,
		position: 'relative',
		border: '1px solid #ced4da',
		borderColor: 'rgba(0, 0, 0, 0.23)',
		fontSize: 12,
		width: '100%',

		'&:before': {
			border: '0 !important',
		},
		'&:after': {
			transition: 'none',
			height: '100%',
			border: '2px solid #3f51b5',
			borderRadius: 4,
		},
		'&:hover': {
			borderColor: '#263238',
		},
		'& #phonenumber': {
			padding: '10.5px 14px',
		},
		'& #refphonenumber': {
			padding: '18px 20px 19px 14px',
		},
	},
}));

const Checkout = ({ userInfo }) => {
	// STRIPE
	const stripe = useStripe();
	const elements = useElements();
	const currDate = new Date('1 31, 2018 07:22:13');
	const dt = new Date(currDate.setMonth(currDate.getMonth() + 1));
	const classes = useStyles();
	const reRef = useRef();
	const [User, setUser] = useState({
		firstName: userInfo.firstName,
		lastName: userInfo.lastName,
		email: userInfo.email,
		phone: {
			textmask: userInfo.phoneNumber.textmask || '(   )    -    ',
			numberformat: '1320',
		},
		line1: userInfo.streetAddress,
		line2: userInfo.streetAddress2nd,
		city: userInfo.city,
		state: userInfo.state,
		postal_code: userInfo.zip,
		country: userInfo.country,
	});
	// const [nextRecurr, setNextRecurr] = useState(dt.toString);

	const [Policy, setPolicy] = useState(false);
	const [Warning, setWarning] = useState({
		message: '',
		type: '',
	});
	const TextMaskCustom = props => {
		const { inputRef, ...other } = props;

		return (
			<MaskedInput
				{...other}
				ref={ref => {
					inputRef(ref ? ref.inputElement : null);
				}}
				mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
				placeholderChar={'\u2000'}
				showMask
				keepCharPositions={true}
			/>
		);
	};
	const onUserHandler = e => {
		const { name, value } = e.target;
		setUser({ ...User, [name]: value });
	};
	const numberOnFocusHandler = e => {
		let textfield = document.getElementById('phonenumber');
		textfield.setSelectionRange(0, 0);
	};

	const SubscribeSubmit = async e => {
		const regexName = /^[a-zA-Z]([\w -]*[a-zA-Z])?$/;

		// Name Check
		if (!(User.firstName.match(regexName) && User.lastName.match(regexName))) {
			setWarning({ message: 'First and last name can only contain alphabets', type: 'error' });
			return null;
		}

		// Policy Check
		// if (!Policy) {
		// 	setWarning({ message: 'Please check the Terms & Conditions', type: 'error' });
		// 	return null;
		// }

		if (!stripe || !elements) {
			// Stripe.js has not yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		const { token } = await stripe.createToken(elements.getElement(CardElement));
		if (!token) {
			return console.log('=== no token === ');
		}
		await axios({
			method: 'POST',
			url: `${API}/stripe/subscribe`,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			data: { token: token.id, User },
			withCredentials: true,
		})
			.then(res => {
				if (res && res.data && res.data.success) {
					console.log('client/components/membership/Checkout.js---------------161:', res.data);
					Router.push(`/membership/thankyou?id=` + res.data.invoiceId);
				} else {
					console.log('Payment failed === ', res.data);
				}
			})
			.catch(e => {
				console.log('=== Payment failed === ', e);
			});
	};

	return (
		<section className="py-5">
			<Container>
				<CssBaseline />
				<Row>
					<Col xs={12} sm={7} lg={6}>
						<Row>
							<Col>
								<Typography component="h1" variant="h5">
									Membership Billing Info
								</Typography>
							</Col>
						</Row>
						<Row>
							<Col>
								<form className="mt-4">
									{Warning.message ? <Alert severity={Warning.type}>{Warning.message}</Alert> : null}
									<TextField
										autoComplete="fname"
										name="firstName"
										variant="outlined"
										required
										fullWidth
										id="firstName"
										label="First Name"
										autoFocus
										value={User.firstName}
										onChange={onUserHandler}
										size="small"
										className={classes.giveMarginTop}
									/>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="lastName"
										label="Last Name"
										name="lastName"
										autoComplete="lname"
										value={User.lastName}
										onChange={onUserHandler}
										size="small"
										className={classes.giveMarginTop}
									/>
									<TextField
										variant="outlined"
										fullWidth
										required
										type="text"
										value={User.line1}
										onChange={onUserHandler}
										name="line1"
										placeholder="123 Wilshire Blvd"
										label="Street Address"
										size="small"
										className={classes.giveMarginTop}
									/>
									<TextField
										variant="outlined"
										fullWidth
										type="text"
										value={User.line2}
										onChange={onUserHandler}
										name="line2"
										placeholder="Unit A"
										label="Street Address Line 2"
										size="small"
										className={classes.giveMarginTop}
									/>
									<TextField
										variant="outlined"
										fullWidth
										required
										type="text"
										value={User.city}
										onChange={onUserHandler}
										name="city"
										placeholder="Los Angeles"
										label="City"
										size="small"
										className={classes.giveMarginTop}
									/>
									<TextField
										variant="outlined"
										fullWidth
										required
										type="text"
										value={User.state}
										onChange={onUserHandler}
										name="state"
										placeholder="CA"
										label="State"
										size="small"
										className={classes.giveMarginTop}
									/>
									<TextField
										variant="outlined"
										fullWidth
										required
										type="text"
										value={User.postal_code}
										onChange={onUserHandler}
										name="postal_code"
										placeholder="90001"
										label="Zip Code"
										size="small"
										className={classes.giveMarginTop}
									/>
									<Input
										required
										fullWidth
										type="tel"
										value={User.phone.textmask}
										onChange={onUserHandler}
										className={classes.inputNumber}
										name="phoneNumber"
										id="phonenumber"
										placeholder="+1 (000)000-0000"
										inputComponent={TextMaskCustom}
										onFocus={numberOnFocusHandler}
										size="small"
										label="Phone Number"
									/>
									<TextField
										variant="outlined"
										fullWidth
										id="email"
										label="Email Address"
										name="email"
										autoComplete="email"
										value={User.email}
										size="small"
										onChange={onUserHandler}
									/>
								</form>
								{/* <ReCAPTCHA sitekey={REACT_APP_RECAPTCHA_KEY} size="invisible" ref={reRef} /> */}
							</Col>
						</Row>
					</Col>

					<Col xs={12} sm={5} lg={6} className="mt-xs-5">
						<Row>
							<Col xs={12} className="mb-4">
								<Typography component="h1" variant="h5">
									Your Order
								</Typography>
							</Col>
							<Col xs={12} className="mb-3">
								<Typography component="span" className={classes.orderSubTitle}>
									Recurring Total:
								</Typography>
								<Typography component="span" className={classes.orderSubTitle}>
									{' '}
									$100.00 / month
								</Typography>
							</Col>

							{/* <Col xs={12} className="mb-3">
								<Typography component="span" className={classes.orderSubTitle}>
									First renewal:
								</Typography>
								<Typography component="span" className={classes.orderPrice}>
								
								</Typography>
							</Col> */}
							<Col xs={12} className="mb-3">
								<Typography component="span" className={classes.orderSubTitle}>
									Payment Section
								</Typography>
							</Col>
							<Col xs={12} className="mb-3">
								{/* <CardInput /> */}
								<CardSection />
							</Col>
							<Col xs={12}>
								<Button type="button" onClick={SubscribeSubmit} className="w-100 solid">
									Subscribe
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default Checkout;
