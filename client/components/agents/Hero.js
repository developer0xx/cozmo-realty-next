import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
const Hero = () => {
	return (
		<section id="hero">
			<Container fluid>
				<Row className="h-25">
					<Col>
						<figure className="agents" />
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default Hero;
