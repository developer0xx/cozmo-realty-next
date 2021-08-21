import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import About from '../components/home/About';
import Hero from '../components/home/Hero';
import Platform from '../components/home/Platform';
import JoinLeadBanner from '../components/home/JoinLeadBanner';
import Contact from '../components/home/Contact';
import Services from '../components/home/Services';
import axios from 'axios';
import { API } from '../config';

import Head from 'next/head';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../actions/auth';

// const fetchLeads = async () => {
// 	return await axios.get(`${API}/leads/get`)
// 	.then(res=>({
// 		error: false,
// 		leads: res.data.leads
// 	}))
// 	.catch (()=> ({
// 		error: true,
// 		leads: null
// 	}))
// }

const fetchCityList = async () => {
	// console.log(API)
	return await axios.get(`${API}/pockets/cities`).then(res => {
		if (res.data && res.data.success) {
			console.log(res.data.cityList)
			return res.data.cityList;
		} else {
			return null;
		}
	});
};

const Index = ({ userInfo, cityList }) => {
	console.log(API)
	// “agent“, “agent-pending“, “coldcaller“, “coldcaller-pending“, “customer“, “mentor“, “mentor-pending“, “new-comer“
	return (
		<Layout userInfo={userInfo} style={'transparent'}>
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
			<main>
				<Hero cityList={cityList} />
				<Platform />
				<Services />
				<About />
				<Contact />
			</main>
		</Layout>
	);
};

export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	const cityList = await fetchCityList();
	console.log('server side props----', userInfo, cityList);
	return { props: { userInfo, cityList } };
};

export default Index;
