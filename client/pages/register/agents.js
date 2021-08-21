import { useState } from 'react';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../actions/auth';
import Layout from '../../components/Layout';
import AgentRegisterForm from '../../components/register/AgentRegisterForm';

const AgentsRequest = props => {
	const { userInfo } = props;
	return (
		<Layout userInfo={userInfo} style={'black'}>
			<AgentRegisterForm userInfo={userInfo} />
		</Layout>
	);
};

export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	return { props: { userInfo } };
};

export default AgentsRequest;
