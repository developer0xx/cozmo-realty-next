import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { API } from '../../../config';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../../actions/auth';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const index = ({ userInfo }) => {
	return (
		<DashboardLayout userInfo={userInfo}>
			<main>
				<section id="mentor">
					<Container spacing={2}>
						<Row className="w-75 w-sm-100 m-auto">
							<Col xs={12}>
								<FormControlLabel control={<Switch checked={true} />} label="Status" />
								<FormControlLabel control={<Switch checked={true} />} label="Profile Picutre" />
								<FormControlLabel control={<Switch checked={true} />} label="Phone Number" />
								<FormControlLabel control={<Switch checked={true} />} label="Email" />
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
	return { props: { userInfo: userInfo } };
};

export default index;
