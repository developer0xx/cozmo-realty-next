import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';

const Footer = () => {
	return (
		<>
			<footer>
				<Container fluid className="dark-background light pt-5 pb-3">
					<Row>
						<Col>
							<Container>
								<Row>
									<Col sm={12} md={3}>
										<h4>About Cozmo Realty</h4>
										<p>
											Cozmo Realty is a highly focused brokerage company and prides itself on outstanding customer service and developing long term relationships to retailers, property owners, and investors. With experienced principals and strong regional market knowledge, Cozmo Realty provides full-service capabilities catered to the needs of its clients.
</p>
									</Col>
									<Col sm={12} md={3}>
										<h4>Menu</h4>
										<Row>
											<Col>
												<ul>
													<li>
														<Link href="/#about">
															<a>About us</a>
														</Link>
													</li>
													<li>
														<Link href="/privacy-policy">
															<a>Privacy Policy</a>
														</Link>
													</li>
													<li>
														<Link href="/terms-and-conditions">
															<a>Terms and Conditions</a>
														</Link>
													</li>

													<li>
														<Link href="/career">
															<a>Career</a>
														</Link>
													</li>
												</ul>
											</Col>
										</Row>
									</Col><Col sm={12} md={3}>
										<h4>Affiliates</h4>
										<Row>
											<Col>
												<ul>
													<li>
														<a href="https://cozmous.com">
															Cozmo US
				</a>
													</li>
													<li>
														<a href="https://cozmofinance.com">
															Hard Money
				</a>
													</li>
													<li>
														<a href="https://cozmoforeclosure.com">
															Foreclosure
				</a>
													</li>

													<li>
														<a href="https://cozmoconsulting.com">
															Consulting
				</a>
													</li>
												</ul>
											</Col>
										</Row>
									</Col><Col sm={12} md={3}>
										<h4>Contact</h4>
										<p><a href="tel:888-887-3711" className="no-deco">888-887-3711</a><br />
											<a href="mailto:info@cozmorealty.com" className="no-deco">info@cozmorealty.com</a><br />
3435 Wilshire Blvd 14th Floor<br />
Los Angeles, CA 90010</p>

										<p>Corporation DRE: 02119229</p>

										<p>* Additional fees may apply if the inquiry comes directly to our agents.</p>
									</Col>
								</Row>

							</Container>
						</Col>
					</Row></Container>
				<Container>
					<Row id="copyright">
						<Col className="text-left" xs={6}>
							<span className="text-left">Copyright © Cozmo Realty 2021</span>
						</Col>
						<Col className="text-right" xs={6}>
							<Link href="/privacy-policy"><a className="no-deco text-right">Privacy Policy</a></Link>
							<span className="d-none d-md-inline-block">&nbsp;&nbsp;</span>
							<Link href="/terms-and-conditions"><a className="no-deco text-right">Terms and Conditions</a></Link>
						</Col>
					</Row>
				</Container>

			</footer>
		</>
	);
};

export default Footer;
