import DashboardLayout from '../../../../../components/dashboard/DashboardLayout';
import UpdateLead from '../../../../../components/dashboard/leads/Update';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../../../../actions/auth';
import axios from 'axios';
import { API } from '../../../../../config';

const fetchLead = async lid => {
	return await axios.get(`${API}/leads/get/${lid}`).then(res => {
		if (res.data && res.data.success) {
			return res.data.leads;
		} else {
			return null;
		}
	});
};

const LeadUpdate = props => {
	return (
		<DashboardLayout userInfo={props.userInfo}>
			<UpdateLead userInfo={props.userInfo} lead={props.leadInfo}></UpdateLead>
		</DashboardLayout>
	);
};

export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const leadInfo = await fetchLead(ctx.params.lid);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	const leadOwner = leadInfo.author === userInfo._id;
	if (userInfo && userInfo.isAuth && !userInfo.role.includes('admin') && !leadOwner) {
		ctx.res.setHeader('location', '/dashboard');
		ctx.res.statusCode = 302;
		ctx.res.end();
	} else {
		return { props: { userInfo, leadInfo } };
	}
};

export default LeadUpdate;
