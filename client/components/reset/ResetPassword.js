import React, { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import axios from 'axios';

import { Container, Row, Col, Button, Image, Alert } from 'react-bootstrap';
import { API } from '../../config';

/* material UI */
import TextField from '@material-ui/core/TextField';

const ResetPasswordPage = props => {
	const Email = useState(props.userInfo.email);
	const [btnDisabled, setBtnDisabled] = useState(false);
	const [Password, setPassword] = useState({
		newPass: '',
		confirmPass: '',
	});
	const [Warning, setWarning] = useState({
		message: '',
		type: '',
	});

	const onPasswordHandler = e => {
		const { name, value } = e.target;
		setPassword({ ...Password, [name]: value });
	};

	const onSubmitHandler = e => {
		e.preventDefault();
		setBtnDisabled(true);

		const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

		if (Password.newPass !== Password.confirmPass) {
			setWarning({ message: 'Password and confirm password do not match', type: 'danger' });
			return null;
		}

		if (!Password.newPass.match(regexPassword)) {
			setWarning({
				message: 'Password must contains minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
				type: 'danger',
			});
			return null;
		}

		let body = {
			email: Email,
			password: Password.newPass,
		};

		axios.put(`${API}/users/resetPassword`, body).then(response => {
			if (response.data.success) {
				Router.push('/login/');
			} else {
				setBtnDisabled(false);
				setWarning({
					message: 'Failed to change password. Please try again later.',
					type: 'danger',
				});
			}
		});
	};

	return (
		<Container fluid id="reset-password-form">
			<div className="form-paper">
				<Col>
					<Link href="/">
						<a>
							<Image className="form-logo" src="/logos/cozmo_black.png" />
						</a>
					</Link>
				</Col>
				<h1 className="form-title">Reset Password</h1>
				<form className="form-wrapper" onSubmit={onSubmitHandler}>
					{Warning.message ? (
						<Alert className="form-input" variant={Warning.type}>
							{Warning.message}
						</Alert>
					) : null}
					<Col className="form-input p0">
						<TextField
							variant="outlined"
							margin="none"
							required
							fullWidth
							name="newPass"
							label="New Password"
							type="password"
							id="password"
							value={Password.newPass}
							onChange={onPasswordHandler}
						/>
					</Col>
					<Col className="form-input p0">
						<TextField
							variant="outlined"
							required
							margin="none"
							fullWidth
							name="confirmPass"
							label="Confirm Password"
							type="password"
							id="confirmPass"
							value={Password.confirmPass}
							onChange={onPasswordHandler}
						/>
					</Col>
					<Col className="form-input p0">
						<Button type="submit" size="lg" block className="solid" disabled={btnDisabled}>
							Reset
						</Button>
					</Col>
				</form>
			</div>
		</Container>
	);
};

export default ResetPasswordPage;
