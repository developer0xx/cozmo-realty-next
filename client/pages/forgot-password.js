import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API } from '../config';

import { Container, Row, Col, Button, Image, Alert } from 'react-bootstrap';

/* Material UI */
import TextField from '@material-ui/core/TextField';

const ForgotPassword = () => {
	const [Email, setEmail] = useState('');
	const [Warning, setWarning] = useState({
		message: '',
		type: '',
	});
	const [btnDisabled, setBtnDisabled] = useState(false);

	const onEmailHandler = e => {
		setEmail(e.currentTarget.value);
	};

	const onSubmitHandler = e => {
		e.preventDefault();
		setBtnDisabled(true);

		let body = {
			email: Email,
		};

		return axios({
			method: 'POST',
			url: `${API}/reset/forgotpassword`,
			headers: {
				Accept: 'application/json',
			},
			data: body,
			withCredentials: true
		}).then(response => {
			if (response.data.success) {
				setBtnDisabled(false);
				setWarning({ message: 'We have just sent you a link to reset your password. This link is valid for 30 minues!', type: 'success' });
				/* props.history.push(`property/${response.data.id}`); */
			} else {
				setBtnDisabled(false);
				setWarning({ message: 'No account found!', type: 'danger' });
			}
		});
	};

	return (
		<Container fluid id="forgot-password-form">
			<Row className="form-paper">
				<Col>
					<Link href="/">
						<a>
							<Image className="form-logo" src="/logos/cozmo_black.png"/>
						</a>
					</Link>
				</Col>
				<h1 className="form-title">Forgot Password?</h1>
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
							value={Email}
							onChange={onEmailHandler}
						/>
					</Col>
					<Col className="form-input p0">
						<Button type="submit" size="lg" block className="solid" disabled={btnDisabled}>
							Email Reset Link
						</Button>
					</Col>
				</form>
			</Row>
		</Container>
	);
};

export default ForgotPassword;
