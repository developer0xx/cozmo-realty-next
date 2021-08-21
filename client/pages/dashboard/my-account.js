import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import MyAccountUpdate from '../../components/myAccount/MyAccountUpdate';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../actions/auth';
import { API } from '../../config';
import axios from 'axios';

const fetchMyAccount = async uid => {
	return await axios.get(`${API}/users/dashboard/my-account/${uid}`).then(res => {
		if (res.data && res.data.success) {
			return res.data.user;
		} else {
			alert('Failed to fetch user data');
		}
	});
};

const MyAccount = props => {
	return (
		<DashboardLayout userInfo={props.userInfo}>
			<MyAccountUpdate myAccountInfo={props.myAccountInfo}></MyAccountUpdate>
		</DashboardLayout>
	);
};
export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	let myAccountInfo = null;
	if (userInfo) {
		myAccountInfo = await fetchMyAccount(userInfo._id);
	} else {
		ctx.res.setHeader("location", "/login");
        ctx.res.statusCode = 302;
        ctx.res.end();
	}
	return { props: { userInfo, myAccountInfo } };
};
export default MyAccount;
