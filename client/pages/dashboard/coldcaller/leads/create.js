import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import CreateLead from '../../../../components/dashboard/leads/Create';

import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../../../actions/auth';

const MyAccount = props => {
	return (
		<DashboardLayout userInfo={props.userInfo}>
			<CreateLead userInfo={props.userInfo}></CreateLead>
		</DashboardLayout>
	);
};

export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	if (userInfo && userInfo.isAuth && !userInfo.role.includes('admin') && !userInfo.role.includes('coldcaller')) {
		ctx.res.setHeader("location", "/dashboard");
        ctx.res.statusCode = 302;
        ctx.res.end();
	} else {
		return { props: { userInfo } };
	}
};

export default MyAccount;
