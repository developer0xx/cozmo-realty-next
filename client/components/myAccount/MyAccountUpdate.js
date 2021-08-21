import React, { useState } from 'react';
import axios from 'axios';

/* material UI */
import TextField from '@material-ui/core/TextField';
import Spinner from '../Spinner';
import MaskedInput from 'react-text-mask';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { API } from '../../config';

import { Container, Row, Col, Button, Alert } from 'react-bootstrap';

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

const MyAccountUpdate = props => {
	const currUser = props.myAccountInfo;
	const [open, setOpen] = useState(false);
	const [password, setPassword] = useState({
		newPass: '',
		confirmPass: '',
	});
	const [User, setUser] = useState({
		firstName: currUser.firstName,
		lastName: currUser.lastName,
		email: currUser.email,
		phoneNumber: {
			textmask: currUser.phoneNumber || '(   )    -    ',
			numberformat: '1320',
		},
		streetAddress: currUser.streetAddress,
		streetAddress2nd: currUser.streetAddress2nd,
		city: currUser.city,
		state: currUser.state,
		zip: currUser.zip,
		country: currUser.country,
		subscribe: currUser.subscribe,
		role: currUser.role,
		_id: currUser._id,
	});
	const [Warning, setWarning] = useState({
		message: '',
		type: '',
	});

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const onPasswordHandler = e => {
		const { name, value } = e.target;
		setPassword({ ...password, [name]: value });
	};
	const onFieldsHandler = e => {
		const { name, value } = e.target;
		setUser({ ...User, [name]: value });
	};

	const onSubmitHandler = e => {
		e.preventDefault();
		let body = {};
		if (password.newPass || password.confirmPass) {
			if (password.newPass !== password.confirmPass) {
				setWarning({ message: 'password and confirm password do not match', type: 'danger' })
				return;
			} else {
				body = { ...User, password: password.newPass };
			}
		} else {
			body = { ...User };
		}
		if (typeof body.phoneNumber === 'object') {
			body.phoneNumber = body.phoneNumber.textfield;
		}

		axios({
			method: 'PUT',
			url: `${API}/users/update`,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			data: JSON.stringify(body),
			withCredentials: true,
		}).then(response => {
			if (response.data.success) {
				setWarning({ message: 'Successfully Updated', type: 'success' })
				return ;
			} else {
				setWarning({ message: 'Failed to update user info', type: 'danger' })
				return ;
			}
		});
	};

	const numberOnFocusHandler = e => {
		let textfield = document.getElementById('phonenumber');
		textfield.setSelectionRange(0, 0);
	};

	const handleDelete = e => {
		axios.put(`${API}/users/put/delete/${currUser._id}`).then(res => {
			if (res.data && res.data.success) {
				props.history.push('/');
			} else {
				alert('Failed to delete account');
			}
		});
	};

	if (!User.email) {
		return <Spinner />;
	} else {
		return (
			<Container fluid id="account-update-form">
				<Row className="form-paper">
					<Col xs={12} sm={8} lg={6} xl={5}>
						{Warning.message ? (
							<Alert className="form-input" variant={Warning.type}>{Warning.message}</Alert>
						) : null}
						<form className="form-wrapper" onSubmit={onSubmitHandler}>
							<h1 className="form-title">User Info</h1>
							<Row className="name-wrapper">
								<Col xs={12} sm={6} className="form-input-firstName">
									<TextField
										autoComplete="fname"
										name="firstName"
										variant="outlined"
										size="small"
										required
										fullWidth
										id="firstName"
										label="First Name"
										autoFocus
										value={User.firstName}
										onChange={onFieldsHandler}
									/>
								</Col>
								<Col xs={12} sm={6} className="form-input-lastName">
									<TextField
										variant="outlined"
										size="small"
										fullWidth
										id="lastName"
										label="Last Name"
										name="lastName"
										autoComplete="lname"
										value={User.lastName}
										onChange={onFieldsHandler}
									/>
								</Col>
							</Row>
							<Col className="form-input p0">
								<h2 className="form-title">Contact Info</h2>
							</Col>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									size="small"
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									value={User.email}
									onChange={onFieldsHandler}
								/>
							</Col>
							<Col className="form-input p0">
								<Input
									required
									fullWidth
									type="tel"
									value={User.phoneNumber.textmask}
									onChange={onFieldsHandler}
									className="inputNumber"
									name="phoneNumber"
									id="phonenumber"
									placeholder="+1 (000)000-0000"
									inputComponent={TextMaskCustom}
									onFocus={numberOnFocusHandler}
									label="Phone Number"
								/>
							</Col>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									size="small"
									fullWidth
									required
									type="text"
									value={User.streetAddress}
									onChange={onFieldsHandler}
									name="streetAddress"
									placeholder="123 Wilshire Blvd"
									label="Street Address"
								/>
							</Col>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									size="small"
									fullWidth
									type="text"
									value={User.streetAddress2nd}
									onChange={onFieldsHandler}
									name="streetAddress2nd"
									placeholder="Unit A"
									label="Street Address Line 2"
								/>
							</Col>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									size="small"
									fullWidth
									required
									type="text"
									value={User.city}
									onChange={onFieldsHandler}
									name="city"
									placeholder="Los Angeles"
									label="City"
								/>
							</Col>

							<Col className="form-input p0">
								<TextField
									variant="outlined"
									size="small"
									fullWidth
									required
									type="text"
									value={User.state}
									onChange={onFieldsHandler}
									name="state"
									placeholder="CA"
									label="State"
								/>
							</Col>

							<Col className="form-input p0">
								<TextField
									variant="outlined"
									size="small"
									fullWidth
									required
									type="text"
									value={User.zip}
									onChange={onFieldsHandler}
									name="zip"
									placeholder="90001"
									label="Zip Code"
								/>
							</Col>

							<Col className="form-input p0">
								<h3 className="form-title">Account Management</h3>
							</Col>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									size="small"
									fullWidth
									name="newPass"
									label="New Password"
									type="password"
									id="newPassword"
									autoComplete="new-password"
									value={password.newPass}
									onChange={onPasswordHandler}
								/>
							</Col>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									size="small"
									fullWidth
									name="confirmPass"
									label="Confirm Password"
									type="password"
									id="confirmPassword"
									autoComplete="new-password"
									value={password.confirmPass}
									onChange={onPasswordHandler}
								/>
							</Col>
							<Col className="form-input p0" >
								<Row spacing={2} className="button-wrapper">
									<Col xs={12} sm={6} className="update-btn-wrapper">
										<Button type="submit" size="lg" block className="solid">
											Update&nbsp;Account
										</Button>
									</Col>
									<Col xs={12} sm={6} className="delete-btn-wrapper">
										<Button size="lg" block className="solid warning-red delete" onClick={handleClickOpen}>
											Delete&nbsp;Account
										</Button>
										<Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
											<DialogTitle id="alert-dialog-title">{'Are you sure you want to DELETE?'}</DialogTitle>
											<DialogContent>
												<DialogContentText id="alert-dialog-description">If you confirm, you CANNOT restore your account again.</DialogContentText>
											</DialogContent>
											<DialogActions>
												<Button onClick={handleClose} className="solid" autoFocus>
													No
												</Button>
												<Button onClick={handleDelete}  className="solid warning-red" >
													Yes
												</Button>
											</DialogActions>
										</Dialog>
									</Col>
								</Row>
							</Col>
						</form>
					</Col>
				</Row>
			</Container>
		);
	}
};

export default MyAccountUpdate;
