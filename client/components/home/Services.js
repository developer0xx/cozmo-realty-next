import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from 'next/image';

const Services = props => {
	return (
		<section id="services" className="py-4 d-flex is-content-justification-center m-auto">
			<Container className="is-content-justification-center m-auto">
				<Row>
					<Col sm={12}>
						<h2 className="mt-4 mb-4">Our Services</h2>
					</Col>
				</Row>
				<Row className="my-4">
					<Col sm={12} md={3} className={'mb-4'}>
						<div className="d-flex justify-content-center">
							<Image src="/home/services/realestate.png" alt="Cozmo white logo" width={100} height={100} />
						</div>
						<span className='d-block text-center'>Cozmo Realty </span>


					</Col>
					<Col sm={12} md={3} className={'mb-4'}>
						<div className="d-flex justify-content-center">
							<Image src="/home/services/finance.png" alt="Cozmo white logo" width={100} height={100} />						</div>

						<span className='d-block text-center'>Cozmo Finance</span>

					</Col>
					<Col sm={12} md={3} className={'mb-4'}>
						<div className="d-flex justify-content-center">
							<Image src="/home/services/foreclosure.png" alt="Cozmo white logo" width={100} height={100} />
						</div>
						<span className='d-block text-center'>Cozmo Foreclosure</span>

					</Col><Col sm={12} md={3} className={'mb-4'}>
						<div className="d-flex justify-content-center">
							<Image src="/home/services/note.png" alt="Cozmo white logo" width={100} height={100} />						</div>

						<span className='d-block text-center'>Cozmo Note Wholesale</span>

					</Col>
				</Row>
				<Row className="mt-1">
					<Col>
						<Button className="primary">LEARN MORE</Button>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default Services;
