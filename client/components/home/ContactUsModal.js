import { useState, useRef } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import Router from 'next/router';

import MaskedInput from 'react-text-mask';
import ReCAPTCHA from 'react-google-recaptcha';

/* material UI */
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Axios from 'axios';
import { API } from '../../config';

import { REACT_APP_RECAPTCHA_KEY } from '../../config';

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

const ContactUsModal = (props) => {
	const [Contact, setContact] = useState({
		email: '',
		name: '',
		message: '',
		phoneNumber: {
			textmask: '(   )    -    ',
			numberformat: '1320',
		},
	});

	const [requested, setRequested] = useState(false);

	const reRef = useRef();

	const onContactHandler = e => {
		const { name, value } = e.target;
		setContact({ ...Contact, [name]: value });
	};

	const onSubmitHandler = async e => {
		e.preventDefault();
		setRequested(true);
		const token = await reRef.current.executeAsync();
		reRef.current.reset();
		let body = Object.assign({}, Contact);
		body = { ...body, token };
		Axios.post(`${API}/mail/contact`, body).then(res => {
			if (res.data.success) {
				alert(`We will be contacting you shortly!`);
				setRequested(false);
				props.onHide();
			} else {
				alert('Failed to send message!');
				setRequested(false);
			}
		});
	};

	const numberOnFocusHandler = e => {
		let textfield = document.getElementById('phonenumber');
		textfield.setSelectionRange(0, 0);
	};

	return (
		<div id="contact-modal">
			<Modal
				{...props}
				size="lg"
				aria-labelledby="filled-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="filled-modal-title-vcenter">
						Contact Us
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className="show-grid" id="contact-modal-body">
					<Container>
						<Row>
							<Col xs={12} lg={6}>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="full-name"
									label="Your Name"
									name="name"
									InputProps={{
										className: "textInput",
									}}
									value={Contact.name}
									onChange={onContactHandler}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									InputProps={{
										className: "textInput",
									}}
									value={Contact.email}
									onChange={onContactHandler}
								/>
								<Input
									required
									fullWidth
									value={Contact.phoneNumber.textmask}
									onChange={onContactHandler}
									className="inputNumber"
									name="phoneNumber"
									id="phonenumber"
									inputComponent={TextMaskCustom}
									onFocus={numberOnFocusHandler}
								/>
							</Col>
							<Col xs={12} lg={6}>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="message"
									label="Message"
									name="message"
									multiline
									rows={9}
									InputProps={{
										className: "textMultiInput",
									}}
									value={Contact.message}
									onChange={onContactHandler}
								/>
							</Col>
						</Row>
					</Container>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={onSubmitHandler} disabled={requested}>
						Send Message
					</Button>
					<Button onClick={props.onHide}>Close</Button>
				</Modal.Footer>
				<ReCAPTCHA sitekey={REACT_APP_RECAPTCHA_KEY} size="invisible" ref={reRef} />
			</Modal>
		</div>
	);
}

export default ContactUsModal;