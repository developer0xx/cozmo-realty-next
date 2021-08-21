import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from 'next/image';
const About = () => {
	return (
		<section id="about" className="dark-background light py-4 d-flex is-content-justification-center m-auto">
			<Container className="m-auto">
				<Row className="is-content-justification-center m-auto">
					<Col sm={12} className="p-0">
						<h2>About Cozmo</h2>

					</Col>
				</Row>
				<Row className="mt-4">
					<Col xs={12} md={6}>
						<p>
							Cozmo is setting the new standard in Real Estate. Cozmo is building the first hybrid real estate brokerage, pairing the real estate industry’s top talent with technology platforms to make the search and sell experience intelligent and seamless.
							It's a well known fact that LISTINGS drive the real estate industry, and we are here to provide our agents with the ultimate in verified premium seller leads.
						</p><p>
							We Connect People to Places.
							Cozmo brings an unmatched depth of expertise to the Real Estate Industry with an unparalleled commitment to our clients, through a diverse multitude of disciplines and capabilities. </p>
					</Col>
					<Col xs={12} md={6}>
						<p>We connect everyday investors, lender, and borrower to a vast world of real estate knowledge and depth of expertise.</p>
						<p>
							Our culture evolves around listings, and listings mean productivity. At Cozmo, we believe that if you aren't listing, you are simply existing. We want our agents to control the inventory and control the market. This revolutionary lead distribution combined with the ultimate in training, our agents will become the unbeatable 007 real estate agent on the market.
							</p><p>
							Come to Cozmo and start living a grand life.
						</p>
					</Col>
				</Row>
				<Button className='primary opposite '>LEARN MORE</Button>

			</Container>
		</section >
	);
};

export default About;
