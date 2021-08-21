import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
const JoinLeadBanner = () => {
	return (
		<section id="leads" className="my-4">
			<Container className="dark-background light py-5 px-5">
				<Row>
					<Col sm={8} md={7}>
						<h2>
							Join Cozmo now, <br />
							Get fresh leads every day!
						</h2>
					</Col>
					<Col sm={4} md={5} className="d-md-flex align-self-center justify-content-end mt-xs-6">
						<Link href="/membership/benefits">
							<Button className="light-see-through">Start free trial</Button>
						</Link>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default JoinLeadBanner;
