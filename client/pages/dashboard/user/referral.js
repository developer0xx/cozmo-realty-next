import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../../actions/auth';
import TextField from '@material-ui/core/TextField';
import { API } from '../../../config';

const getReferralLink = async userInfo => {
	return await axios
		.get(`${API}/url/get/referral/${userInfo._id}`)
		.then(async res => {
			if (res.data.referralLink) {
				return res.data.referralLink;
			} else {
				let body = {
					uid: userInfo._id,
				};
				return await axios({
					method: 'POST',
					url: `${API}/url/post/referral`,
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					data: JSON.stringify(body),
					withCredentials: true,
				})
					.then(response => {
						if (response.data.success && response.data.referralLink) {
							return response.data.referralLink;
						} else {
							return false;
						}
					})
					.catch(error => console.log(error));
			}
		})
		.catch(err => console.log(err));
};

//

const Referral = props => {
	const [ButtonLabel, setButtonLabel] = useState('Copy Link to Clipboard');
	return (
		<DashboardLayout userInfo={props.userInfo}>
			<main>
				<section id="referral">
					<Container spacing={2}>
						<Row className="w-75 w-sm-100 m-auto">
							<Col xs={12}>
								<h1 className="header-size-reduced">Refer a Friend</h1>
							</Col>
							<Col xs={12}>
								<TextField variant="outlined" type="text" margin="normal" fullWidth label="Referral Link" value={props.referral || ''}></TextField>
							</Col>
							<Col xs={12}>
								<button
									className="solid font-size-14 w-100"
									onClick={() => {
										navigator.clipboard.writeText(props.referral);
										setButtonLabel('Link Copied!');
									}}
								>
									{ButtonLabel}
								</button>
							</Col>
						</Row>
					</Container>
				</section>
			</main>
		</DashboardLayout>
	);
};

export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	const referralLink = await getReferralLink(userInfo);
	return { props: { userInfo: userInfo, referral: referralLink } };
};

export default Referral;
