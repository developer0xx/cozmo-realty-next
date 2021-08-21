import React, { useEffect } from 'react';
import PropertyDescription from '../components/temp/PropertyDescription';
import Gallery from './../components/temp/Gallery';
import MainInfo from './../components/temp/MainInfo';
import MorgageInfo from './../components/temp/MorgageInfo';
import Map from './../components/temp/Map';
import SideInfo from './../components/temp/SideInfo';

import { Container, Row, Col } from 'react-bootstrap';

const temp = () => {
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
	return (
		<section id="single-item">
			<Container>
				{console.log(propertyInfo)}
				{propertyInfo && propertyInfo.id ? (
					<Row className="mt-5">
						<Col sm={12} lg={8}>
							{/* gallery */}
							{/* <Gallery propertyInfo={propertyInfo} /> */}
							{/* Information  */}
							<MainInfo propertyInfo={propertyInfo} />
							{/* Morgage Information */}
							{propertyInfo.loanType === 'refinance/cash out' ? <MorgageInfo propertyInfo={propertyInfo} /> : null}
							{propertyInfo.loanType === '2nd' ? <MorgageInfo propertyInfo={propertyInfo} /> : null}
							{propertyInfo.loanType === '3rd' ? <MorgageInfo propertyInfo={propertyInfo} /> : null}
							{propertyInfo.loanType === 'bridge/mezz' ? <MorgageInfo propertyInfo={propertyInfo} /> : null}

							{/* Description */}
							{propertyInfo ? <PropertyDescription propertyInfo={propertyInfo} /> : <div className="my-5"></div>}
							{/* Map */}
							{propertyInfo.subjectPropertyAddr && propertyInfo.subjectPropertyAddr.location ? <Maps propertyInfo={propertyInfo} /> : <div className="py-3"></div>}
						</Col>
						<Col sm={12} lg={4}>
							<div className="bg-illust-wrapper">
								<figure className="bottom-right-waffle" />
							</div>
							<SideInfo propertyInfo={propertyInfo} />
						</Col>
					</Row>
				) : (
					// <Spinner />
					<h1>data null</h1>
				)}
			</Container>
		</section>
	);
};

export default temp;
