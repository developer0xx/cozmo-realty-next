import React from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import MembershipStatus from '../../../components/dashboard/agent/MembershipStatus';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../../actions/auth';
import axios from 'axios';
import { API } from '../../../config';
// Stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_hj7I8OXD90Pm2g57j7WE1uKE');

// YOU CAN EDIT
const fetchOrderInfo = async order_id => {
	return await axios.get(`${API}/stripe/order/${order_id}`, { withCredentials: true }).then(res => {
		if (res.data.success) {
			return res.data.orderInfo;
		} else {
			return null;
		}
	});
};

// YOU CAN EDIT
const fectchOrderId = async uid => {
	return await axios.get(`${API}/stripe/${uid}`, { withCredentials: true }).then(res => {
		if (res.data && res.data.success) {
			return res.data.order_id;
		} else {
			return null;
		}
	});
};

const membership = ({ userInfo, orderInfo,CustomerHistory,SubscriptionList,CardsList }) => {
	console.log(orderInfo);

	return (
		<DashboardLayout userInfo={userInfo}>
			<Elements stripe={stripePromise}>
				<MembershipStatus userInfo={userInfo} orderInfo={orderInfo} CardsList={CardsList} CustomerHistory={CustomerHistory} SubscriptionList={SubscriptionList}></MembershipStatus>
			</Elements>
		</DashboardLayout>
	);
};

const getSubscriptionList = async (cookieHeader)=>{
	return await axios({
		method: 'GET',
		url: `${API}/stripe/subscriptionsList`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			cookie: cookieHeader
		},
		withCredentials: true,
	}).then(d=>{ 
		if(!d.data||!d.data.success){console.log('===error====',d.data);return {};}
		//console.log('list == ',d.data.list)
		return  d.data.list||[];
		}).catch(e=>{
		console.log(e);
		return {}
	});
}

const getCustomerHistory = async (cookieHeader)=>{
	return await axios({
		method: 'GET',
		url: `${API}/stripe/customerHistory`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			cookie: cookieHeader
		},
		withCredentials: true,
	}).then(d=>{ 
		if(!d.data||!d.data.success){console.log('===error====',d.data);return {};}
		//console.log('list == ',d.data.list)
		return  d.data.list||[];
	}).catch(e=>{
		console.log(e);
		return {}
	});
}

const getCardsList = async (cookieHeader)=>{
	return await axios({
		method: 'GET',
		url: `${API}/stripe/cardsList`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			cookie: cookieHeader
		},
		withCredentials: true,
	}).then(d=>{ 
		if(!d.data||!d.data.success){console.log('===error====',d.data);return {};}
		//console.log('list == ',d.data.list)
		return  d.data.list||[];
	}).catch(e=>{
		console.log(e);
		return {}
	});
}

export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	const order_id = await fectchOrderId(userInfo?._id);
	const orderInfo = await fetchOrderInfo(order_id);
	const SubscriptionList = await getSubscriptionList(cookieHeader);
	const CustomerHistory = await getCustomerHistory(cookieHeader);
	const CardsList = await getCardsList(cookieHeader);
	return { props: { userInfo, orderInfo,  SubscriptionList, CustomerHistory,CardsList} };
};

export default membership;
