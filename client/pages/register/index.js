import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../actions/auth';
import RegisterForm from '../../components/register/RegisterForm';

const Register = props => {
	return <RegisterForm />;
};

export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	if (userInfo && userInfo.isAuth) {
		ctx.res.setHeader("location", "/");
        ctx.res.statusCode = 302;
        ctx.res.end();
	} else {
		return { props: { } };
	}
};

export default Register;
