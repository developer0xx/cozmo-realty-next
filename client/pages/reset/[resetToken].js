import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../actions/auth';
import axios from 'axios';
import { API } from '../../config';
import ResetPassword from '../../components/reset/ResetPassword';
import ExpiredLink from '../../components/reset/ExpiredLink';

const getUserEmail = async token => {
	return await axios.get(`${API}/reset/get/email/${token}`).then(res => {
		console.log(res.data);
		if (res.data && res.data.user) {
			return(res.data.user.email);
		} else {
			return('expiredLink');
		}
	});
};

const ResetPasswordPage = props => {
	console.log(props)
	if (props.email === 'expiredLink') {
		return <ExpiredLink />
	} else {
		return <ResetPassword userInfo={{ email : props.email }} />;
	}
};

export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	console.log(cookie);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	if (userInfo && userInfo.isAuth && !userInfo.role.includes('admin')) {
		ctx.res.setHeader("location", "/");
        ctx.res.statusCode = 302;
        ctx.res.end();
	} else {
		return { props: { email: await getUserEmail(ctx.params.resetToken) } };
	}
};

export default ResetPasswordPage;