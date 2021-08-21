import { useState } from 'react';
import { API } from '../../config';
import Link from 'next/link';
import Router from 'next/router';
import Spinner from '../Spinner';

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

const MentorRegisterForm = props => {
	const userInfo = props.agentInfo.agent;
	const { agentInfo } = props;

	// const [Property, setProperty] = useState({
	// 	streetAddress: '',
	// 	streetAddress2nd: '',
	// 	city: '',
	// 	state: '',
	// 	zip: '',
	// 	country: 'United States',
	// });

	const [transaction, setTransactions] = useState({
		transactions: '',
		transactions2: '',
	});
	const [PDFDownloaded, setPDFDownloaded] = useState(false);
	const [OnLoad, setOnLoad] = useState(false);
	const [Warning, setWarning] = useState({
		message: '',
		type: '',
	});

	const onTransaction = e => {
		const { name, value } = e.target;
		setTransactions({ ...transaction, [name]: value });
	};

	const onPDFDownload = e => {
		setPDFDownloaded(true);
	};

	const onSubmitHandler = async e => {
		e.preventDefault();
		setOnLoad(true);

		let userFilledData = {
			id: userInfo._id,
			role: userInfo.role,
			transaction: transaction.transactions,
			transaction2: transaction.transactions2,
		};

		return await Axios(`${API}/users/register/role/mentor`, {
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
					setWarning({ message: 'Please input the valid information.', type: 'error' });
					setOnLoad(false);
					return null;
				} else if (data.success === false && data.type === 'mailer-issue') {
					setWarning({ message: 'Failed to send email. Please try again.', type: 'error' });
					setOnLoad(false);
					return null;
				} else if (data.success === true) {
					Router.push('/register/welcome/mentor');
				} else {
					setWarning({ message: 'Something went wrong. Please try again.', type: 'error' });
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
								{Warning.message}
							</Alert>
						) : null}
						<form className="form-wrapper" onSubmit={onSubmitHandler}>
							<h1 className="form-title">User Info</h1>
							<Col className="form-input p0">
								<TextField size="small" fullWidth label="Full Name" value={userInfo.firstName + ` ` + userInfo.lastName} disabled />
							</Col>
							<Row>
								<Col className="form-input">
									<TextField fullWidth size="small" value={userInfo.phoneNumber} name="phoneNumber" label="Phone Number" disabled />
								</Col>
								<Col className="form-input">
									<TextField disabled fullWidth size="small" type="email" value={userInfo.email} name="email" label="Email" disabled />
								</Col>
							</Row>
							<Row></Row>
							<Col className="form-input p0">
								<TextField
									disabled
									fullWidth
									type="text"
									name="streetAddress"
									label="Full Address"
									value={userInfo.streetAddress + ` ` + userInfo.streetAddress2nd}
									size="small"
								/>
							</Col>
							<Row>
								<Col className="form-input">
									<TextField disabled fullWidth type="text" name="city" placeholder="Los Angeles" label="City" value={userInfo.city} size="small" />
								</Col>
								<Col className="form-input">
									<TextField disabled fullWidth type="text" name="state" placeholder="CA" label="State" value={userInfo.state} size="small" />
								</Col>
								<Col className="form-input">
									<TextField disabled fullWidth type="text" name="zip" label="Zip Code" value={userInfo.zip} size="small" />
								</Col>
							</Row>
							<Col className="form-input p0">
								<TextField
									disabled
									fullWidth
									size="small"
									value={agentInfo.dreNum}
									name="dreNum"
									required
									placeholder="DRE License #"
									label="DRE License #"
									disabled
								/>
							</Col>
							<hr></hr>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									fullWidth
									required
									type="text"
									name="transactions"
									value={transaction.transactions}
									onChange={onTransaction}
									placeholder="0"
									label="Number of transactions closed in the last 12 months"
									size="small"
								/>
							</Col>
							<Col className="form-input p0">
								<TextField
									variant="outlined"
									fullWidth
									required
									type="text"
									value={transaction.transactions2}
									onChange={onTransaction}
									name="transactions2"
									placeholder="0"
									label="Number of transactions closed with Cozmo Realty in the last 12 months"
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

export default MentorRegisterForm;
