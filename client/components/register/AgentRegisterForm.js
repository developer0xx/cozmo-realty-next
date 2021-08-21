import { useState } from 'react';
import { API } from '../../config';
import Link from 'next/link';
import Router from 'next/router';
import Spinner from '../../components/Spinner';

/* Material UI */
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import MaskedInput from 'react-text-mask';
import Axios from 'axios';
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

const AgentRegisterForm = props => {
	const { userInfo } = props;

	const [User, setUser] = useState({
		email: userInfo.email,
		firstName: userInfo.firstName,
		lastName: userInfo.lastName,
		dreNum: '',
		agentSince: '',
		allTransactions: '',
		phoneNumber: {
			textmask: '(   )    -    ',
			numberformat: '1320',
		},
	});

	const [Property, setProperty] = useState({
		streetAddress: '',
		streetAddress2nd: '',
		city: '',
		state: '',
		zip: '',
		country: 'United States',
	});

	const [PDFDownloaded, setPDFDownloaded] = useState(false);
	const [OnLoad, setOnLoad] = useState(false);
	const [Warning, setWarning] = useState({
		message: '',
		type: '',
	});

	const onPDFDownload = e => {
		setPDFDownloaded(true);
	};

	const onUserHandler = e => {
		const { name, value } = e.target;
		setUser({ ...User, [name]: value });
	};

	const onPropertyHandler = e => {
		const { name, value } = e.target;
		setProperty({ ...Property, [name]: value });
	};

	const numberOnFocusHandler = e => {
		let textfield = document.getElementById('phonenumber');
		textfield.setSelectionRange(0, 0);
	};

	const onSubmitHandler = async e => {
		e.preventDefault();
		setOnLoad(true);
		const regexName = /^[a-zA-Z]([\w -]*[a-zA-Z])?$/;

		if (!(User.firstName.match(regexName) && User.lastName.match(regexName))) {
			setWarning({ message: 'First and last name can only contain alphabets', type: 'error' });
			return null;
		}

		/* if (!Policy) {
			setWarning({ message: 'Please check the Terms & Conditions', type: 'error' });
			return null;
		} */
		let userFilledData = {
			id: userInfo._id,
			role: userInfo.role,
			...User,
			...Property,
		};

		return await Axios(`${API}/users/register/role/agent`, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			data: {
				userFilledData,
			},
			withCredentials: true,
		})
			.then(({ data }) => {
				if (data.success === false && data.type === 'db-issue') {
					setWarning({ message: 'Please input the valid information.', type: 'danger' });
					setOnLoad(false);
					return null;
				} else if (data.success === false && data.type === 'mailer-issue') {
					setWarning({ message: 'Failed to send email. Please try again.', type: 'danger' });
					setOnLoad(false);
					return null;
				} else if (data.success === false && data.type === 'already-applied') {
					setWarning({
						message: 'You have already applied to be an agent. Please contact us at <strong>info@cozmorealty.com</strong> if you have any questions.',
						type: 'danger',
					});
					setOnLoad(false);
					return null;
				} else if (data.success === true) {
					Router.push('/register/welcome/agent');
				} else {
					setWarning({ message: 'Something went wrong. Please try again.', type: 'danger' });
					setOnLoad(false);
					return null;
				}
			})
			.catch(err => console.log(err));
	};
	if (OnLoad) {
		return <Spinner />;
	} else {
		return (
			<Container fluid id="agents-form">
				<Row className="form-paper">
					<Col xs={12} sm={8} lg={6} xl={5}>
						{Warning.message ? (
							<Alert className="form-input" variant={Warning.type}>
								<span dangerouslySetInnerHTML={{ __html: Warning.message }} />
							</Alert>
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
										onChange={onUserHandler}
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
										onChange={onUserHandler}
									/>
								</Col>
							</Row>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									fullWidth
									size="small"
									value={User.dreNum}
									name="dreNum"
									required
									onChange={onUserHandler}
									placeholder="DRE License #"
									label="DRE License #"
								/>
							</Col>
							<Col className="form-input p0">
								<Input
									required
									fullWidth
									type="tel"
									value={User.phoneNumber.textmask}
									onChange={onUserHandler}
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
									fullWidth
									size="small"
									type="number"
									value={User.agentSince}
									name="agentSince"
									required
									onChange={onUserHandler}
									placeholder="2020"
									label="Working as Agent Since..."
								/>
							</Col>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									fullWidth
									size="small"
									type="number"
									value={User.allTransactions}
									name="allTransactions"
									required
									onChange={onUserHandler}
									placeholder="1"
									label="# of Transactions made"
								/>
							</Col>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									fullWidth
									size="small"
									type="email"
									value={User.email}
									name="email"
									required
									onChange={onUserHandler}
									placeholder="your@email.com"
									label="Email"
									disabled
								/>
							</Col>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									fullWidth
									required
									type="text"
									value={Property.streetAddress}
									onChange={onPropertyHandler}
									name="streetAddress"
									placeholder="123 Wilshire Blvd"
									label="Street Address"
									size="small"
								/>
							</Col>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									fullWidth
									type="text"
									value={Property.streetAddress2nd}
									onChange={onPropertyHandler}
									name="streetAddress2nd"
									placeholder="Unit A"
									label="Street Address Line 2"
									size="small"
								/>
							</Col>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									fullWidth
									required
									type="text"
									value={Property.city}
									onChange={onPropertyHandler}
									name="city"
									placeholder="Los Angeles"
									label="City"
									size="small"
								/>
							</Col>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									fullWidth
									required
									type="text"
									value={Property.state}
									onChange={onPropertyHandler}
									name="state"
									placeholder="CA"
									label="State"
									size="small"
								/>
							</Col>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									fullWidth
									required
									type="text"
									value={Property.zip}
									onChange={onPropertyHandler}
									name="zip"
									placeholder="90001"
									label="Zip Code"
									size="small"
								/>
							</Col>
							<Col className="form-input p0">
								<Link href="/documents/Agent_signup_form.pdf">
									<a target="_blank" className="pdfDescriptionAnchor">
										<Button className="solid warning-red" onClick={onPDFDownload}>
											Download PDF
										</Button>
									</a>
								</Link>
							</Col>
							<Col className="form-input p0">
								<span className="pdfDescription">
									Please download the PDF, sign and email it to:
									<br />
									<span className="pdfDescriptionEmail">info@cozmorealty.com</span>
									<br />
									We will approve your account after a quick review.
								</span>
							</Col>
							<Col className="button-wrapper">
								<Button type="submit" size="lg" block className="solid warning-red" disabled={!PDFDownloaded}>
									Submit
								</Button>
							</Col>
						</form>
					</Col>
				</Row>
			</Container>
		);
	}
};

export default AgentRegisterForm;
