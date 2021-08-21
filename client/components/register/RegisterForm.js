import { useState, useRef } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import ReCAPTCHA from 'react-google-recaptcha';
import { register } from '../../actions/auth';
import { REACT_APP_RECAPTCHA_KEY } from '../../config';

/* Material UI */
import TextField from '@material-ui/core/TextField';
import { Container, Row, Col, Button, Image, Alert } from 'react-bootstrap';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const RegisterForm = ({}) => {
	const reRef = useRef();

	const [User, setUser] = useState({
		email: '',
		firstName: '',
		lastName: '',
		password: '',
		confirmPassword: '',
	});
	const [Subscribe, setSubscribe] = useState(false);
	const [Policy, setPolicy] = useState(false);
	const [Warning, setWarning] = useState({
		message: '',
		type: '',
	});

	const onUserHandler = e => {
		const { name, value } = e.target;
		setUser({ ...User, [name]: value });
	};

	const onSubscribeHandler = e => {
		Subscribe ? setSubscribe(false) : setSubscribe(true);
	};

	const onPolicyHandler = e => {
		Policy ? setPolicy(false) : setPolicy(true);
	};

	const onSubmitHandler = async e => {
		e.preventDefault();
		const token = await reRef.current.executeAsync();
		reRef.current.reset();
		const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		const regexName = /^[a-zA-Z]([\w -]*[a-zA-Z])?$/;

		if (!(User.firstName.match(regexName) && User.lastName.match(regexName))) {
			setWarning({ message: 'First and last name can only contain alphabets', type: 'danger' });
			return null;
		}

		if (User.password !== User.confirmPassword) {
			setWarning({ message: 'Password and confirm password do not match', type: 'danger' });
			return null;
		}

		if (!User.password.match(regexPassword)) {
			setWarning({
				message: 'Password must contains minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
				type: 'danger',
			});
			return null;
		}

		if (!Policy) {
			setWarning({ message: 'Please check the Terms & Conditions', type: 'danger' });
			return null;
		}
		let body = {
			firstName: User.firstName,
			lastName: User.lastName,
			email: User.email,
			password: User.password,
			subscribe: Subscribe,
			token,
		};

		register(body).then(response => {
			Router.push('/register/roles');
			// if (response.success) {
			// 	props.history.push('/login');
			// } else {
			// 	alert('Failed to log up');
			// }
		});
	};

	return (
		<Container fluid id="register-form">
			<Row className="form-paper">
				<Col>
					<Link href="/">
						<a>
							<Image className="form-logo" src="/logos/cozmo_black.png" />
						</a>
					</Link>
				</Col>
				<h1 className="form-title">Register</h1>
				<form className="form-wrapper" onSubmit={onSubmitHandler}>
					{Warning.message ? (
						<Alert className="form-input" variant={Warning.type}>
							{Warning.message}
						</Alert>
					) : null}
					<Row className="name-wrapper">
						<Col xs={12} sm={6} className="form-input-firstName">
							<TextField
								autoComplete="fname"
								name="firstName"
								variant="outlined"
								required
								fullWidth
								id="firstName"
								label="First Name"
								value={User.firstName}
								onChange={onUserHandler}
							/>
						</Col>
						<Col xs={12} sm={6} className="form-input-lastName">
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
							/>
						</Col>
					</Row>
					<Col className="form-input p0">
						<TextField
							variant="outlined"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							type="email"
							autoComplete="email"
							value={User.email}
							onChange={onUserHandler}
						/>
					</Col>
					<Col className="form-input p0">
						<TextField
							variant="outlined"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							value={User.password}
							onChange={onUserHandler}
						/>
					</Col>
					<Col className="form-input p0">
						<TextField
							variant="outlined"
							required
							fullWidth
							name="confirmPassword"
							label="Confirm Password"
							type="password"
							id="confirm-password"
							value={User.confirmPassword}
							onChange={onUserHandler}
						/>
					</Col>
					<Col className="form-input ta-left">
						<FormControlLabel
							className="formControl"
							control={<Checkbox value={Policy} onChange={onPolicyHandler} color="primary" />}
							label={
								<span>
									I accept the&nbsp;
									<Link href="/terms-and-conditions">
										<a>Terms and conditions</a>
									</Link>
									&nbsp;and&nbsp;
									<Link href="/privacy-policy">
										<a>Privacy Policy</a>
									</Link>
								</span>
							}
						/>
					</Col>
					<Col className="form-input p0">
						<Button type="submit" size="lg" block className="solid">
							Sign In
						</Button>
					</Col>
					<Col xs={12} className="form-input p0">
						Already have an account?&nbsp;&nbsp;
						<Link href="/login" variant="body2">
							Sign&nbsp;in
						</Link>
					</Col>
				</form>
				<ReCAPTCHA sitekey={REACT_APP_RECAPTCHA_KEY} size="invisible" ref={reRef} />
			</Row>
		</Container>
	);
};

export default RegisterForm;
