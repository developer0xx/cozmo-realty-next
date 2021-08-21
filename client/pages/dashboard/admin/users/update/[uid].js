import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../../../components/dashboard/DashboardLayout';
import UserAccountUpdate from '../../../../../components/dashboard/admin/users/update/UserAccountUpdate';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../../../../actions/auth';
import { API } from '../../../../../config';
import axios from 'axios';

const fetchUserAccount = async uid => {
	return await axios.get(`${API}/users/dashboard/my-account/${uid}`).then(res => {
		if (res.data && res.data.success) {
			return res.data.user;
		} else {
			alert('Failed to fetch user data');
			6;
		}
	});
};

const UserAccount = props => {
	return (
		<DashboardLayout userInfo={props.userInfo}>
			<UserAccountUpdate userAccountInfo={props.userAccountInfo}></UserAccountUpdate>
		</DashboardLayout>
	);
};
export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	const userAccountInfo = await fetchUserAccount(ctx.params.uid);
	return { props: { userInfo, userAccountInfo } };
};
export default UserAccount;
