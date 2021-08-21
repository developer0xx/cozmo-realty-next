import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../actions/auth';

const Dashboard = ({ userInfo }) => {
	return <DashboardLayout userInfo={userInfo}>Dashboard</DashboardLayout>;
};
export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	return { props: { userInfo } };
};
export default Dashboard;
