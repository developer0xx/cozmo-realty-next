import { useEffect } from 'react';
import Router from 'next/router';
import { getUserInfoSSR } from '../../actions/auth';
// getUserInfoSSR
const Admin = ({ children }) => {
	useEffect(() => {
		if (!getUserInfoSSR()) {
			Router.push(`/login`);
			// getUserInfoSSR
		} else if (getUserInfoSSR().role !== 1) {
			Router.push(`/`);
		}
	}, []);
	return <React.Fragment>{children}</React.Fragment>;
};

export default Admin;
