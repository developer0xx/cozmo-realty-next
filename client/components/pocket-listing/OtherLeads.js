import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
const OtherLeads = ({ leads }) => {
	return (
		<section id="other-leads" className="roboto mt-6">
			<Container className="">
				<Row className="mb-2">
					<Col className="p-0">
						<h1>Other Leads</h1>
					</Col>
				</Row>
				{leads.map(lead => {
					return (
						<Link href={`/pocket-listings/${lead._id}`}>
							<a>
								<Row className="h-100 mb-3 shadow p-2 pointer">
									<Col xs={4} className="p-0">
										<div
											className="square"
											style={{
												backgroundImage: `url('/property/image-from-rawpixel-id-558306-jpeg.jpg')`,
											}}
										></div>
									</Col>
									<Col xs={8} className="my-auto px-md-4">
										<h3 className="mb-1">${lead.appValue}</h3>
										<p className="mb-1">
											{lead.property.streetName}, {lead.property.city} {lead.property.zip}
										</p>
										<h4 className="mb-0">Take Now</h4>
									</Col>
								</Row>
							</a>
						</Link>
					);
				})}
			</Container>
		</section>
	);
};

export default OtherLeads;
