import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Router from 'next/router';
import { Editor } from '@tinymce/tinymce-react';
import { API } from '../../../config';
import UploadedImages from './UploadedImages';

/* material UI */
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import NumberFormat from 'react-number-format';
import MaskedInput from 'react-text-mask';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import { MenuItem } from '@material-ui/core';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';

import Spinner from '../../Spinner';
/* import ItemDropzone from '../../components/leads/ItemDropzone'; */

const TINY_MCE_API_KEY = process.env.REACT_APP_TINY_MCE_API_KEY;

const NumberFormatCustom = props => {
	const { inputRef, onChange, ...other } = props;
	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={values => {
				onChange({
					target: {
						name: props.name,
						value: values.value,
					},
				});
			}}
			thousandSeparator
			isNumericString
			prefix="$"
		/>
	);
};

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

const statuses = [
	{
		value: 'pending',
		label: 'Pending',
	},
	{
		value: 'edited',
		label: 'Edited',
	},
	{
		value: 'deleted',
		label: 'Deleted',
	},
	{
		value: 'verified',
		label: 'Verified',
	},
	{
		value: 'processing',
		label: 'Processing',
	},
	{
		value: 'completed',
		label: 'Completed',
	},
];

const propertyType = [
	{
		value: 'commercial',
		label: 'Commercial',
	},
	{
		value: 'residential',
		label: 'Residential',
	},
];

const CreateLead = props => {
	const today = new Date(Date.now());

	const uploadButton = useRef();

	const [Fields, setFields] = useState({
		company: '',
		appValue: '',
		notes: '',
		additionalNotes: '',
		firstName: '',
		lastName: '',
		email: '',
		images: [],
		phoneNumber: {
			textmask: '(   )    -    ',
			numberformat: '1320',
		},
		status: 'pending',
		dateCalled: '',
	});

	const [Property, setProperty] = useState({
		propertyType: '',
		streetAddress: '',
		streetNumber: '',
		streetName: '',
		streetAddress2nd: '',
		city: '',
		state: '',
		zip: '',
		country: 'United States',
		submarket: '',
	});

	const [error, setError] = useState('');

	const [onLoad, setOnLoad] = useState(false);

	const [FormUploadData, setFormUploadData] = useState();
	const [Images, setImages] = useState([]);

	const [DeletedImgs, setDeletedImgs] = useState([]);

	const [Warning, setWarning] = useState({
		message: '',
		type: '',
	});

	useEffect(() => {
		setFormUploadData(new FormData());
	}, []);
	let currentUserData = {};
	const currentUser = props.userInfo;
	currentUserData = { ...currentUserData, ...currentUser };

	const onPropertyHandler = e => {
		const { name, value } = e.target;
		setProperty({ ...Property, [name]: value });
		setWarning({
			message: '',
			type: '',
		});
	};
	const onFieldsHandler = e => {
		const { name, value } = e.target;
		setFields({ ...Fields, [name]: value });
		setWarning({
			message: '',
			type: '',
		});
	};

	const numberOnFocusHandler = e => {
		let textfield = document.getElementById('phonenumber');
		textfield.setSelectionRange(0, 0);
	};

	const handleEditorChange = e => {
		setFields({ ...Fields, notes: e.target.getContent() });
	};

	const handlePublish = e => {
		e.preventDefault();
		setFields({ ...Fields, status: 'verified' });
		onSubmit('verified');
	};

	const handleSave = e => {
		e.preventDefault();
		onSubmit(Fields.status);
	};

	const onImageUpload = async files => {
		for (let key in files) {
			if (files.hasOwnProperty(key)) {
				Object.assign(files[key], {
					preview: URL.createObjectURL(files[key]),
				});
			}
		}
		if (Images.length + files.length > 10) {
			setWarning({
				message: 'You cannot upload more than 10 images.',
				type: 'danger',
			});
		} else {
			setWarning({
				message: '',
				type: '',
			});
			setImages([...Images, ...files]);
			for (let key in files) {
				if (files.hasOwnProperty(key)) {
					FormUploadData.append('files', files[key]);
				}
			}
			setFormUploadData(FormUploadData);
		}
	};

	const uploadImagetoDB = async (leads, id) => {
		const response = await axios({
			method: 'POST',
			url: `${API}/upload/${leads}/${id}`,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data',
			},
			data: FormUploadData,
			withCredentials: true,
		});
		return response.data;
	};

	const onSubmit = status => {
		if (Fields.phoneNumber === '(   )    -    ') {
			setError('Phone Number is required.');
		} else {
			setOnLoad(true);
			let body = Object.assign({}, Fields);
			body.property = { ...Property };
			Property.streetNumber.trim();
			Property.streetName.trim();
			Property.streetAddress2nd.trim();
			body.property.streetAddress = Property.streetNumber + ' ' + Property.streetName + (Property.streetAddress2nd ? ', ' + Property.streetAddress2nd : '');
			body.status = status;
			body['author'] = currentUserData._id;
			if (typeof body.phoneNumber === 'object') {
				body.phoneNumber = body.phoneNumber.textfield;
			}
			axios({
				method: 'POST',
				url: `${API}/leads/create`,
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				data: JSON.stringify(body),
				withCredentials: true,
			}).then(response => {
				if (response.data.success) {
					uploadImagetoDB('leads', response.data.id).then(res => {
						if (res.success && res.uploaded) {
							setOnLoad(false);
							setWarning({ message: 'Successfully Uploaded', type: 'success' });
							window.scrollTo(0, 0);
							return Router.push('/dashboard/coldcaller/leads');
						} else {
							setOnLoad(false);
							setWarning({ message: 'Failed to upload image.', type: 'danger' });
							window.scrollTo(0, 0);
							return;
						}
					});
				}
			});
		}
	};
	return (
		<>
			{onLoad ? (
				<Spinner />
			) : (
				<Container fluid id="create-lead-form">
					<Row className="form-paper">
						<Col xs={12} sm={8} lg={6} xl={5}>
							{Warning.message ? (
								<Alert className="form-input" variant={Warning.type}>
									{Warning.message}
								</Alert>
							) : null}
							<form className="form-wrapper" onSubmit={onSubmit}>
								<h1 className="form-title">Submit New Lead</h1>
								<UploadedImages
									FormUploadData={FormUploadData}
									setFormUploadData={setFormUploadData}
									Fields={Fields}
									Images={Images}
									setImages={setImages}
									DeletedImgs={DeletedImgs}
									setDeletedImgs={setDeletedImgs}
									setWarning={setWarning}
								/>
								<Button className="solid warning-red" onClick={e => uploadButton.current.click()}>
									Browse...
									<input type="file" onChange={e => onImageUpload(e.target.files)} multiple style={{ display: 'none' }} ref={uploadButton} />
								</Button>
								<Col className="form-input p0">
									<TextField
										variant="outlined"
										fullWidth
										size="small"
										id="datetime-local"
										label="Date Called"
										type="datetime-local"
										name="dateCalled"
										value={Fields.dateCalled}
										onChange={onFieldsHandler}
										InputLabelProps={{
											shrink: true,
										}}
									/>
								</Col>
								<Row className="name-wrapper">
									<Col xs={12} sm={6} className="form-input-firstName">
										<TextField
											variant="outlined"
											fullWidth
											size="small"
											required
											type="text"
											value={Fields.firstName}
											name="firstName"
											onChange={onFieldsHandler}
											placeholder="First Name"
											label="First Name"
										/>
									</Col>
									<Col xs={12} sm={6} className="form-input-lastName">
										<TextField
											variant="outlined"
											fullWidth
											size="small"
											required
											type="text"
											value={Fields.lastName}
											name="lastName"
											onChange={onFieldsHandler}
											placeholder="Last Name"
											label="Last Name"
										/>
									</Col>
								</Row>
								<Col className="form-input p0">
									<TextField
										variant="outlined"
										fullWidth
										size="small"
										type="email"
										value={Fields.email}
										name="email"
										required
										onChange={onFieldsHandler}
										placeholder="investors@email.com"
										label="Investor's Email"
									/>
								</Col>
								<Col className="form-input p0">
									<Input
										required
										fullWidth
										type="tel"
										onChange={onFieldsHandler}
										className="inputNumber"
										name="phoneNumber"
										id="phonenumber"
										placeholder="+1 (000)000-0000"
										inputComponent={TextMaskCustom}
										onFocus={numberOnFocusHandler}
										label="Phone Number"
										value={Fields.phoneNumber.textmask}
									/>
								</Col>
								<Col className="form-input p0">
									<TextField
										variant="outlined"
										fullWidth
										size="small"
										type="text"
										value={Fields.company}
										name="company"
										onChange={onFieldsHandler}
										placeholder="Company"
										label="Company"
										autoFocus
									/>
								</Col>
								<Col className="form-input p0">
									<div>
										<TextField
											variant="outlined"
											fullWidth
											size="small"
											select
											required
											value={Property.propertyType}
											name="propertyType"
											onChange={onPropertyHandler}
											label="Property Type"
										>
											{propertyType.map(option => (
												<MenuItem key={option.value} value={option.value}>
													{option.label}
												</MenuItem>
											))}
										</TextField>
									</div>
								</Col>
								<Row className="address-wrapper">
									<Col className="form-input-street-number" xs={3}>
										<TextField
											variant="outlined"
											fullWidth
											size="small"
											required
											type="text"
											value={Property.streetNumber}
											onChange={onPropertyHandler}
											name="streetNumber"
											placeholder="0000"
											label="St. #"
										/>
									</Col>
									<Col className="form-input-street-name" xs={6}>
										<TextField
											variant="outlined"
											fullWidth
											size="small"
											required
											type="text"
											value={Property.streetName}
											onChange={onPropertyHandler}
											name="streetName"
											placeholder="Wilshire Blvd"
											label="Street Name"
										/>
									</Col>
									<Col className="form-input-unit-number" xs={3}>
										<TextField
											variant="outlined"
											fullWidth
											size="small"
											type="text"
											value={Property.streetAddress2nd}
											onChange={onPropertyHandler}
											name="streetAddress2nd"
											placeholder="Unit #"
											label="Unit #"
										/>
									</Col>
								</Row>
								<Col className="form-input p0">
									<TextField
										variant="outlined"
										fullWidth
										size="small"
										required
										type="text"
										value={Property.city}
										onChange={onPropertyHandler}
										name="city"
										placeholder="Los Angeles"
										label="City"
									/>
								</Col>
								<Col className="form-input p0">
									<TextField
										variant="outlined"
										fullWidth
										size="small"
										required
										type="text"
										value={Property.state}
										onChange={onPropertyHandler}
										name="state"
										placeholder="CA"
										label="State"
									/>
								</Col>
								<Col className="form-input p0">
									<TextField
										variant="outlined"
										fullWidth
										size="small"
										required
										type="text"
										value={Property.zip}
										onChange={onPropertyHandler}
										name="zip"
										placeholder="90001"
										label="Zip Code"
									/>
								</Col>
								<Col className="form-input p0">
									<TextField
										variant="outlined"
										fullWidth
										size="small"
										required
										type="text"
										value={Property.submarket}
										onChange={onPropertyHandler}
										name="submarket"
										placeholder="DTLA"
										label="Submarket"
									/>
								</Col>
								<Col className="form-input p0">
									<TextField
										variant="outlined"
										label="Estimated Appraisal Value"
										fullWidth
										size="small"
										required
										value={Fields.appValue}
										onChange={onFieldsHandler}
										name="appValue"
										placeholder="$1,000,000"
										InputProps={{
											inputComponent: NumberFormatCustom,
										}}
									/>
								</Col>
								<Col className="form-input p0">
									<Editor
										apiKey={TINY_MCE_API_KEY}
										// initialValue="<p>Initial content</p>"
										init={{
											forced_root_block: false,
											placeholder: 'Notes',
											height: 300,
											menubar: false,
											plugins: [
												'advlist autolink lists link image',
												'charmap print preview anchor help',
												'searchreplace visualblocks code',
												'insertdatetime media table paste wordcount',
											],
											toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help',
										}}
										onChange={handleEditorChange}
									/>
								</Col>
								<Col className="form-input p0">
									<TextField
										variant="outlined"
										fullWidth
										type="text"
										value={Fields.additionalNotes}
										onChange={onFieldsHandler}
										name="additionalNotes"
										placeholder="Additional notes"
										label="Additional notes"
										size="small"
										style={{ marginBottom: '16px' }}
									/>
								</Col>

								<Divider className="divider" />
								<Col className="form-input p0">
									<TextField
										variant="outlined"
										fullWidth
										size="small"
										select
										required
										value={Fields.status}
										name="status"
										onChange={onFieldsHandler}
										label="Status"
									>
										{statuses.map(option => (
											<MenuItem
												key={option.value}
												value={option.value}
												className={option.value === 'processing' ? 'statusProcessing' : option.value === 'completed' ? 'statusCompleted' : ''}
											>
												{option.label}
											</MenuItem>
										))}
									</TextField>
								</Col>

								<Col className="form-input p0">
									<Row spacing={2} className="button-wrapper">
										<Col xs={12} sm={6} className="update-btn-wrapper">
											<Button
												onClick={handlePublish}
												size="lg"
												block
												className="solid warning-red"
												disabled={Fields.status === 'pending' || Fields.status === 'verified' || Fields.status === 'edited' ? false : true}
											>
												Publish
											</Button>
										</Col>
										<Col xs={12} sm={6} className="delete-btn-wrapper">
											<Button onClick={handleSave} size="lg" block className="solid">
												Save
											</Button>
										</Col>
									</Row>
								</Col>
							</form>
						</Col>
					</Row>
				</Container>
			)}
		</>
	);
};

export default CreateLead;
