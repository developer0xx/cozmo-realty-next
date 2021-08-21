import { useState } from 'react';
import ContactUsModal from './ContactUsModal';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import VerticalCenter from '../../components/VerticalCenter';

const Contact = () => {
	const [modalShow, setModalShow] = useState(false);

	return (
		<section id="contact" className="py-4 d-flex is-content-justification-center m-auto">
			<Container className="m-auto">
				<Row className="is-content-justification-center m-auto">
					<Col >
						<Container >
							<Row >
								<Col sm={12} md={6} className="is-content-justification-center m-auto" >
									<div>
										<h2>Contact Us</h2>
										<h3>Do You Have Any Questions?</h3>
										<p>We appreciate the opportunity to connect with new people.</p>
										<Button className="primary" onClick={() => setModalShow(true)}>
											Contact us
						</Button>

										<ContactUsModal show={modalShow} onHide={() => setModalShow(false)} />
									</div>


								</Col>
								<Col sm={12} md={6} >
									<div style={{ width: '100%', height: 'auto' }}>
										<Image src={'/home/contact.png'}
											alt="contact us"
											quality={100}
											layout='responsive'
											width={600}
											height={547} />
									</div>

								</Col>
							</Row>
						</Container>
					</Col>

				</Row>
			</Container>
		</section >
	);
};

export default Contact;
