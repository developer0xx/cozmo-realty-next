import { useState } from 'react';
import { parseCookies } from 'nookies';
import { getUserInfoSSR, isAuth } from '../../actions/auth';
import { API } from '../../config';
import Link from 'next/link';
import Router from 'next/router';
import Spinner from '../../components/Spinner';
import axios from 'axios';

const updateUserToCustomer = async userInfo => {
	return await axios({
		method: 'put',
		url: `${API}/users/register/role/customer`, 
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		data: userInfo,
		withCredentials: true,
	}).then(res => {
		console.log(res);
		return res;
	})
}

const CustomerRequestPage = props => {
	return <Spinner/>;
}

export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	const userUpdated = await updateUserToCustomer(userInfo);
	if (userUpdated) {
		ctx.res.setHeader("location", "/");
        ctx.res.statusCode = 302;
        ctx.res.end();
	} else {
		return { props: {  } };
	}
};

export default CustomerRequestPage