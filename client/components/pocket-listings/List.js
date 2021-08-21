import React, { useRef } from 'react';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import useResize from '../utils/useResize';
import { Container, Row, Col, Button } from 'react-bootstrap';
//import Image from 'next/Image';
const List = ({ leads }) => {
	const imgRef = useRef();
	const { width } = useResize(imgRef);

	const encryptEmail = email => {
		let username = email.split('@')[0].replace(/^.{2}/g, 'XX');
		let domain = email.split('@')[1].replace(/^.{3}/g, 'XXX');
		return username + '@' + domain;
	};

	const encryptPhone = phone => {
		let number = phone.split('-');
		number[0] = number[0].replace(/.{3}$/g, 'XXX');
		number[1] = number[1].replace(/.{3}$/g, 'XXX');
		return number[0] + '-' + number[1];
	};

	return (
		<section id="lead-list-page" className="py-4">
			<Container>
				<Row>
					<Col sm={12}>
						<h1 className="text-center">Leads</h1>
					</Col>
				</Row>
				<Row className="mt-4 card-wrapper">
					{/* for image resizing reference */}
					{leads.map((lead, i) => {
						return (
							<Col xs={12} sm={6} md={4} lg={3} className="my-4 single-card px-2" ref={ i === 0 ? imgRef : null } key={`lead-${i}`}>
								<Link href={`/pocket-listings/${lead._id}`}>
									<Card className="shadow-none border">
										<Card.Img variant="top" src={lead.images[0] ? lead.images[0] : '/property/image-from-rawpixel-id-558306-jpeg.jpg'} width={ width } height={ (width / 1.618) } style={{ objectFit: 'cover' }} />
										<Card.Body className="pb-2">
											<Card.Title>{lead.property.streetName}</Card.Title>
											<Card.Text className="lead-description"><span dangerouslySetInnerHTML={{ __html: lead.notes }} /></Card.Text>
											<hr className="my-2" />
											<Card.Text className="my-0 text-muted no-wrap contact-info">{ lead.email ? encryptEmail(lead.email) : '\u00A0' } </Card.Text>
											<Card.Text className="mb-0 text-muted no-wrap contact-info">{ lead.phoneNumber ? encryptPhone(lead.phoneNumber) : '\u00A0' } </Card.Text>
										</Card.Body>
									</Card>
								</Link>
							</Col>
						);
					})}
				</Row>
			</Container>
		</section>
	);
};

export default List;
