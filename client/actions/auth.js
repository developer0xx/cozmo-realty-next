import fetch from 'isomorphic-fetch';
import cookie from 'js-cookie';
import { API } from '../config';
import axios from 'axios';
axios.defaults.withCredentials = true;

export const register = user => {
	return fetch(`${API}/users/register`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const login = user => {
	return axios({
		method: 'POST',
		url: `${API}/users/login`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		data: JSON.stringify(user),
		withCredentials: true,
	})
		.then(response => {
			console.log(response);
			return response;
		})
		.catch(err => console.log(err));
};

export const logout = async next => {
	return await axios
		.get(`${API}/users/logout`, { withCredentials: true })
		.then(response => {
			removeCookie('express:sess.sig');
			removeCookie('express:sess');
			return true;
		})
		.catch(err => console.log(err));
};

// set cookie
export const setCookie = (key, value) => {
	if (process.browser) {
		cookie.set(key, value, {
			expires: 1,
		});
	}
};

export const removeCookie = key => {
	if (process.browser) {
		cookie.remove(key, {
			expires: 1,
		});
	}
};
// get cookie
export const getCookie = key => {
	if (process.browser) {
		return cookie.get(key);
	}
};

export const isAuth = async () => {
	if (process.browser) {
		/* const cookieChecked = getCookie('express:sess');
		console.log(cookieChecked)
		if (cookieChecked) { */
		/* if (localStorage.getItem('user')) {
				return JSON.parse(localStorage.getItem('user'));
			} else {
				return false;
			} */
		return await axios
			.get(`${API}/users/auth`, { withCredentials: true })
			.then(response => {
				if (response && response.data && response.data.isAuth === true) {
					return response.data;
				} else {
					return false;
				}
			})
			.catch(err => console.log(err));
	}
	/* } else {
		return false;
	} */
};

export const getUserInfoSSR = async cookieHeader => {
	return await axios
		.get(`${API}/users/auth`, {
			withCredentials: true,
			headers: {
				Cookie: cookieHeader,
			},
		})
		.then(response => {
			if (response && response.data && response.data.isAuth === true) {
				return response.data;
			} else {
				return false;
			}
		})
		.catch(err => console.log(err));
};
