import { useState } from 'react';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../actions/auth';
import Layout from '../../components/Layout';
import MentorRegisterForm from '../../components/register/MentorRegisterForm';
import axios from 'axios';
import { API } from '../../config';

const MentorRequest = props => {
	const userInfo = props.agentInfo.agent;
	return (
		<Layout userInfo={userInfo} style={'black'}>
			<MentorRegisterForm agentInfo={props.agentInfo} />
		</Layout>
	);
};

const fetchAgent = async (uid, cookieHeader) => {
	return await axios({
		method: 'GET',
		url: `${API}/users/get/agent/${uid}`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			cookie: cookieHeader,
		},
		withCredentials: true,
	}).then(res => {
		return res.data.agent;
	});
};

export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	const agentInfo = await fetchAgent(userInfo._id, cookieHeader);

	return { props: { agentInfo } };
};

export default MentorRequest;
