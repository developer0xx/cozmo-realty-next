import React, { useState, useRef } from 'react';
import { parseCookies } from 'nookies';
import { getUserInfoSSR, register, isAuth } from '../../actions/auth';
import Checkout from '../../components/membership/Checkout';

import Layout from '../../components/Layout';
// import { Container, Row, Col, Button } from 'react-bootstrap';

import Head from 'next/head';

// Stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_hj7I8OXD90Pm2g57j7WE1uKE');

const Join = ({ userInfo }) => {
	return (
		<Layout userInfo={userInfo} style={'black'}>
			<Head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<title>Cozmo Realty</title>
				<meta name="description" content="" />
				<link rel="canonical" href="https://cozmorealty.com/" />
				<meta property="og:locale" content="en_US" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Cozmo Realty" />
				<meta property="og:description" content="" />
				<meta property="og:url" content="https://cozmorealty.com/" />
				<meta property="og:site_name" content="Cozmo Realty" />
				<meta property="og:image" content="" />
			</Head>
			{/* {((userInfo.role.includes('agent') || userInfo.role.includes('mentor')) && !userInfo.role.includes('membership')) ? : {
				
			}} */}
			<main className="mt-99px">
				<Elements stripe={stripePromise}>
					<Checkout userInfo={userInfo}></Checkout>
				</Elements>
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

export default Join;
