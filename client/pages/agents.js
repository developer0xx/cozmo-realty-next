import React from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../actions/auth';
import FacebookIcon from '@material-ui/icons/Facebook';
import EmailIcon from '@material-ui/icons/Email';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import Hero from '../components/agents/Hero';

import JoinLeadBanner from '../components/home/JoinLeadBanner';
const Agents = props => {
	return (
		<Layout userInfo={props.userInfo} style="black">
			<Head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<title>Leads - Cozmo Realty</title>
				<meta name="description" content="" />
				<link rel="canonical" href="https://cozmorealty.com/Leads" />
				<meta property="og:locale" content="en_US" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Leads - Cozmo Realty" />
				<meta property="og:description" content="" />
				<meta property="og:url" content="https://cozmorealty.com/Leads" />
				<meta property="og:site_name" content="Cozmo Realty" />
				<meta property="og:image" content="" />
			</Head>
			<main>
				<Hero />
				<section>
					<Container className="">
						<Row className="">
							<Col sm={12} md={12}>
								<h1>Cozmo Agents</h1>
								<p>
									Completely synergize resource taxing relationships via premier niche markets. Professionally cultivate one-to-one customer service with robust
									ideas. Dynamically innovate resource-leveling customer service for state of the art customer service.
								</p>
							</Col>
						</Row>
						<Row>
							<Col md={3} className="py-2">
								<img src="/agents/agent.jpg" width="100%" height="auto"></img>
								<span className="agent-name">Brandon Han</span>
								<Row>
									<Col>
										<EmailIcon />
										<PhoneIphoneIcon />
										<FacebookIcon />
										<TwitterIcon />
										<InstagramIcon />
									</Col>
								</Row>
							</Col>
							<Col md={3} className="py-2">
								<img src="/agents/agent.jpg" width="100%" height="auto"></img>
							</Col>
							<Col md={3} className="py-2">
								<img src="/agents/agent.jpg" width="100%" height="auto"></img>
							</Col>
							<Col md={3} className="py-2">
								<img src="/agents/agent.jpg" width="100%" height="auto"></img>
							</Col>
						</Row>
					</Container>
				</section>
				<JoinLeadBanner />
			</main>
		</Layout>
	);
};

export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	return { props: { userInfo } };
};

export default Agents;
