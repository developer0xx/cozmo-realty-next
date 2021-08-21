import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';

const SideInfo = ({ propertyInfo }) => {
	const onSubmitHandler = async e => {
		e.preventDefault();
		setAlert({ status: 'secondary', message: 'Sending a message...' });
		let body = Object.assign({}, Contact);
		body = { ...body, propertyInfo };
		axios.post('/api/mail/invest', body).then(res => {
			if (res.data.success) {
				setAlert({ status: 'success', message: 'We will be contacting you shortly!' });
			} else {
				// alert('Failed to send message!');
				setAlert({ status: 'warning', message: 'Failed to send message!' });
			}
		});
	};
	return (
		<section className="side-info w-100 bg-white mb-5">
			<Container className="bg-white pr-0">
				<Col className="p-0">
					<span className="d-block mt-2">
						Total Loan Amount:
						<span className="side-info-price d-block mt-1">
							{propertyInfo.loanType === 'fix & flip/Rehab' ? propertyInfo.loanAmt + propertyInfo.fixUpCost : propertyInfo.loanAmt}
						</span>
					</span>
					<span className="d-block mt-3">
						Loan Type: <span className="side-loan-type text-capitalize">{propertyInfo.loanType}</span>
					</span>
					<span className="d-block mt-2">Contact:</span>
					<div className="side-contact">
						<span className="d-block mt-2 ml-0">
							{/* <Arrowhead /> */}→<span>info@cozmofinance.com</span>
						</span>

						<span className="d-block mt-2 ml-0">
							{/* <Arrowhead /> */}→<span>Los Angeles, CA</span>
						</span>
					</div>
					<Link href="/">
						<Button className="primary-button mr-3 mt-3">
							<span className="button-inner-text">Login to Invest</span>
						</Button>
					</Link>
				</Col>
			</Container>
		</section>
	);
};

export default SideInfo;
