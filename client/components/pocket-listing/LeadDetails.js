import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'next/image';
import PropertyDescription from './PropertyDescription';
import Gallery from './Gallery';
import MainInfo from './MainInfo';
import MorgageInfo from './MorgageInfo';
import Map from './Map';
import SideInfo from './SideInfo';

const LeadDetails = ({ lead, userInfo, /* main, mainHandler */ }) => {
	const property = lead.property;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const propertyInfo = {
		mortgageBalance: { index: 23 },
		loanType: 'refinance/cash out',
		fixUpCost: 3000,
		loanAmt: 300000,
		fixUpCost: 200001,
		id: 202,
		subjectPropertyAddr: { city: 'Oakland' },
		loandescription: 'NOD proptery. Borrower needs to refinance to get out of the Foreclosure process',
	};

	console.log(property)

	return (
		<section id="lead-carousel">
			<Container className="detail px-0 roboto mt-6">
				<Row>
					<Col sm={12} lg={8}>
						{/* gallery */}
						{/* <Gallery propertyInfo={propertyInfo} /> */}
						{/* Information  */}
						<MainInfo propertyInfo={propertyInfo} />
						{/* Morgage Information */}
						{/* {propertyInfo.loanType === 'refinance/cash out' ? <MorgageInfo propertyInfo={propertyInfo} /> : null}
						{propertyInfo.loanType === '2nd' ? <MorgageInfo propertyInfo={propertyInfo} /> : null}
						{propertyInfo.loanType === '3rd' ? <MorgageInfo propertyInfo={propertyInfo} /> : null}
						{propertyInfo.loanType === 'bridge/mezz' ? <MorgageInfo propertyInfo={propertyInfo} /> : null} */}

						{/* Description */}
						{/* {propertyInfo ? <PropertyDescription propertyInfo={propertyInfo} /> : <div className="my-5"></div>} */}
						{/* Map */}
						{/* {propertyInfo.subjectPropertyAddr && propertyInfo.subjectPropertyAddr.location ? <Maps propertyInfo={propertyInfo} /> : <div className="py-3"></div>} */}
					</Col>
				</Row>
				<Row className="mt-4">
					<Col>
						<h3>Description</h3>
						<p dangerouslySetInnerHTML={{ __html: lead.notes }} />
					</Col>
				</Row>
			</Container>
			<Container></Container>
		</section>
	);
};

export default LeadDetails;
