import { useState, useRef } from 'react';
import { login } from '../../actions/auth';
import Router from 'next/router';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { API } from '../../config'
/* Material UI */
import TextField from '@material-ui/core/TextField';
import { Container, Row, Col, Button, Image, Alert } from 'react-bootstrap';

import { REACT_APP_RECAPTCHA_KEY } from '../../config';

const LoginForm = () => {
	const reRef = useRef();
	const [User, setUser] = useState({
		email: '',
		password: '',
	});
	const [Warning, setWarning] = useState({
		message: '',
		type: '',
	});

	const onUserHandler = e => {
		const { name, value } = e.target;
		setUser({ ...User, [name]: value });
	};

	const onSubmitHandler = async e => {
		e.preventDefault();
		// console.table({ name, email, password, error, loading, message, showForm });
		const token = await reRef.current.executeAsync();
		reRef.current.reset();

		let body = {
			email: User.email,
			password: User.password,
			token,
		};
		
		login(body).then(({ data }) => {
			if (data && data.error) {
				setValues({ ...values, error: data.error, loading: false });
			} else {
				// save user token to cookie
				// save user info to localstorage
				// authenticate user
				// 나중에 수정해야함
				if (data && data.user && data.user.isAuth
					&& (data.user.role.includes('new-comer'))) {
					Router.push(`/register/roles`);
				} else if (data && data.user && data.user.isAuth) {
					Router.push('/');
				} else {
					setWarning({ type: 'danger', message: 'Invalid Email or Password.' })
					Router.push('/login');
				}
			}
		});
	};

	return (
		<Container fluid id="login-form">
			<Row className="form-paper">
				<Col>
					<Link href="/">
						<a>
							<Image className="form-logo" src="/logos/cozmo_black.png" />
						</a>
					</Link>
				</Col>
				<h1 className="form-title">Login</h1>
				<form className="form-wrapper" onSubmit={onSubmitHandler}>
					{Warning.message ? <Alert variant={Warning.type}>{Warning.message}</Alert> : null}
					<Col className="form-input p0">
						<TextField
							variant="outlined"
							margin="none"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							value={User.email}
							onChange={onUserHandler}
						/>
					</Col>
					<Col className="form-input p0">
						<TextField
							variant="outlined"
							margin="none"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							value={User.password}
							onChange={onUserHandler}
						/>
					</Col>
					<Col className="form-input p0">
						<Button type="submit" size="lg" block className="solid">
							Sign In
						</Button>
					</Col>
					<Col className="form-input p0">
						<h5>or sign in with</h5>
					</Col>
					<Col>
						<Row className="oauth-logins">
							<Col xs={12} sm={6} className="form-input p0">
								<Button size="lg" block className="solid facebook-button" href={`${API}/users/auth/facebook`}>
									FACEBOOK
								</Button>
							</Col>
							<Col xs={12} sm={6} className="form-input p0">
								<Button size="lg" block className="solid google-button" href={`${API}/users/auth/google`}>
									GOOGLE
								</Button>
							</Col>
						</Row>
					</Col>
					<Col>
						<Row>
							<Col xs={12} className="form-input p0">
								Don't have an account?&nbsp;&nbsp;
								<Link href="/register" variant="body2">
									Sign Up
								</Link>
							</Col>
							<Col xs={12} className="p0">
								<Link href="/forgot-password" variant="body2">
									Forgot password?
								</Link>
							</Col>
						</Row>
					</Col>
				</form>
				<ReCAPTCHA sitekey={REACT_APP_RECAPTCHA_KEY} size="invisible" ref={reRef} />
			</Row>
		</Container>
	);
};

export default LoginForm;
