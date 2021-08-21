import React, { useState } from 'react';
import { Container, Row, Col, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { API } from '../../config';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';

const Contact = ({ lead, takeHandle, modalShow, setModalShow, ContactInfo, setContactInfo, onContactHandler, phoneNumberHandler, alert, submitProcess }) => {
	return (
		<section id="lead-contact" className="roboto">
			<Container className="border p-4">
				<Row>
					<Col>
						<h2 className="mb-0">{lead.firstName + ' ' + lead.lastName}</h2> 
						<p>Agent</p>
					</Col>
				</Row>
				<Row>
					<Col sm={12} md={3}>
						<strong>
							<p className="dark mb-0">Email:</p>
						</strong>
					</Col>
					<Col sm={12} md={9}>
						<p className="text-right mb-0">
							<a href={`mailto:${lead.email}`}>{lead.email}</a>
						</p>
					</Col>
				</Row>
				<Row>
					<Col sm={12} md={3}>
						<strong>
							<p className="dark mb-2">Phone:</p>
						</strong>
					</Col>
					<Col sm={12} md={9}>
						<p className="text-right mb-2">
							<a href={`tel:${lead.phoneNumber}`}>{lead.phoneNumber}</a>
						</p>
					</Col>
				</Row>
				<Row>
					<Col>
						<Button className="primary-button" onClick={() => setModalShow(true)}>
							Submit Proposal
						</Button>
						<span className='d-block mt-4'>Want to talk with our agent? <br />We will reach out within 24 business hours to assist you.</span>
						<Modal show={modalShow} onHide={() => setModalShow(false)} centered id="borrower-contact-form">
							<Modal.Header closeButton>
								<Modal.Title>Want more details about property?</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Container className="bg-white px-0">
									<form onSubmit={takeHandle}>
										<Row>
											<Col xs={12} className="mb-3">{alert.message ? <Alert variant={alert.status}>{alert.message}</Alert> : <></>}</Col>
											<Col xs={12} sm={6} className="pr-sm-2 pl-sm-3 px-3 mb-3">
												<Form.Control
													required
													type="text"
													name="firstName"
													value={ContactInfo.firstName}
													onChange={onContactHandler}
													placeholder="First Name"
												/>
											</Col>
											<Col xs={12} sm={6} className="pl-sm-2 pr-sm-3 px-3 mb-3">
												<Form.Control 
													required 
													type="text" 
													name="lastName" 
													value={ContactInfo.lastName} 
													onChange={onContactHandler} 
													placeholder="Last Name" 
												/>
											</Col>
											<Col xs={12} className="px-3 mb-3">
												<Form.Control
													required
													type="email"
													name="email"
													autoComplete="email"
													value={ContactInfo.email}
													onChange={onContactHandler}
													placeholder="Email Address"
												/>
											</Col>
											<Col xs={12} className="px-3 mb-3">
												<PhoneInput
													specialLabel={false}
													country="us"
													onlyCountries={['us']}
													disableDropdown
													disableCountryCode
													value={ContactInfo?.phoneNumber ? ContactInfo.phoneNumber.toString() : ''}
													placeholder={'Phone Number'}
													name="phoneNumber"
													onChange={phoneNumberHandler}
												/>
											</Col>
											<Col xs={12} className="px-3 mb-3">
												<Form.Control
													required
													name="message"
													value={ContactInfo.message}
													onChange={onContactHandler}
													as="textarea"
													rows="5"
													style={{ resize: 'none' }}
													placeholder="Your Message"
												/>
											</Col>
											<Col xs={12} className="px-3 mb-3">
												<Form.Check 
													type={'checkbox'}
													id={`NDA-checkbox`}
													label={`By marking this Checkbox, I agree to not to disclose any of infromation given by this agent to the others nor to the public. I agree to sign on this NDA provided by Cozmo Realty.`}
													style={{ fontSize: '0.8em', color: '#303030' }}
													onClick={e => setContactInfo({ ...ContactInfo, NDA: !ContactInfo.NDA })}
													disabled={submitProcess}
												/>
											</Col>
										</Row>

										<div className="button-wrapper mt-2">
											<Button type="submit" className="primary-button  mr-3" disabled={submitProcess || !ContactInfo.NDA}>
												{submitProcess && submitProcess !== 'success' ? <span className="button-inner-text"><Spinner animation="border" /></span> : submitProcess === 'success' ? <span className="button-inner-text">Message Sent!</span> : <span className="button-inner-text">Send Message</span> }
												
											</Button>
										</div>
									</form>
								</Container>
							</Modal.Body>
						</Modal>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default Contact;
