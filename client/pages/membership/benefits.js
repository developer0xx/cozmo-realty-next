import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../actions/auth';

const benefits = props => {
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
			<main className="mt-99px">
				Membership benefits list here
				<Link href="/membership/join">
					<Button>Join Membership Now</Button>
				</Link>
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

export default benefits;
