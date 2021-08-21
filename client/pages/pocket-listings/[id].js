import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import LeadDetails from '../../components/pocket-listing/LeadDetails';
import Contact from '../../components/pocket-listing/Contact';
import OtherLeads from '../../components/pocket-listing/OtherLeads';
import { Container, Row, Col } from 'react-bootstrap';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../actions/auth';
import axios from 'axios';
import { API } from '../../config';
import useSWR from 'swr';

/* const preFetchOtherLeads = async id => {
	return await axios.get(`${API}/pockets/other/${id}`).then(res => {
		if (res.data && res.data.success) {
			return res.data.leads;
		} else {
			return null;
		}
	});
}; */

const preFetchLead = async id => {
	return await axios.get(`${API}/pockets/${id}`).then(res => {
		if (res.data && res.data.success) {
			return res.data.pocket;
		} else {
			return null;
		}
	});
};

const fetchLead = async (...args) => {
	return await axios.get(...args).then(res => {
		console.log(res);
		if (res.data && res.data.success) {
			return res.data.pocket;
		} else {
			return null;
		}
	});
};

const Lead = ({ userInfo, id, /* preFetchedOtherLeads,  */preFetchedLead }) => {
	const { data: lead } = useSWR(`${API}/pockets/${id}`, fetchLead, { initialData: preFetchedLead });
	/* const { data: leads } = useSWR(`${API}/pockets/other/${id}`, fetchLead, { initialData: preFetchedOtherLeads }); */

	const [modalShow, setModalShow] = useState(false);
	
    const [ContactInfo, setContactInfo] = useState({
		uid: userInfo?._id ? userInfo._id : null,
        firstName: userInfo && userInfo.firstName ? userInfo.firstName : '',
        lastName: userInfo && userInfo.lastName ? userInfo.lastName : '',
        email: userInfo && userInfo.email ? userInfo.email : '',
        phoneNumber: '',
        message: '',
		NDA: false
    });
	
    const [alert, setAlert] = useState({
        status: '',
        message: '',
    });

	const [submitProcess, setSubmitProcess] = useState(false);

	/* const [main, setMain] = useState(lead.images[0] ? lead.images[0] : '/property/image-from-rawpixel-id-558306-jpeg.jpg'); */
	useEffect(() => {
		/* setMain(lead && lead.images !== undefined ? lead.images[0] : '/property/image-from-rawpixel-id-558306-jpeg.jpg'); */
	}, [lead]);
	
	const onContactHandler = e => {
        const { name, value } = e.target;
        setContactInfo({ ...ContactInfo, [name]: value });
    };
	
    const phoneNumberHandler = e => {
        setContactInfo({ ...ContactInfo, phoneNumber: e });
    };

	const takeHandle = async e => {
		e.preventDefault();
		setSubmitProcess(true);
		setAlert({ status: 'secondary', message: 'Sending a message...' });
		let body = Object.assign({}, {
			authorId: lead.author,
			claimers: {
				...ContactInfo,
				uid: userInfo?._id ? userInfo._id : null
			},
			pocketId: lead._id,
			leadType: 'pocket-listing'
		});
		return await axios({
			method: 'PUT',
			url: `${API}/claims/update`,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			data: JSON.stringify(body),
			withCredentials: true,
		})
			.then(response => {
				if (response.data.success) {
					setAlert({ status: 'success', message: 'We will be contacting you shortly!' });
					setSubmitProcess('success');
				}
				return response;
			})
			.catch(err => {
				console.log(err);
				setAlert({ status: 'warning', message: 'Failed to send message!' });
				setSubmitProcess(false);
			});
	};

	/* const mainHandler = e => {
		setMain(e.target.src);
	}; */

	return (
		<Layout userInfo={userInfo} style={'black'}>
			<Head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<title>Pocket Listings - Cozmo Realty</title>
				<meta name="description" content="" />
				<link rel="canonical" href="https://cozmorealty.com/pocket-listings" />
				<meta property="og:locale" content="en_US" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Pocket Listings - Cozmo Realty" />
				<meta property="og:description" content="" />
				<meta property="og:url" content="https://cozmorealty.com/pocket-listings" />
				<meta property="og:site_name" content="Cozmo Realty" />
				<meta property="og:image" content="" />
			</Head>
			<main className="mt-99px">
				<section id="singleLead">
					<Container fluid className="">
						<Row className="h-100 justify-content-sm-center">
							<Col sm={12} md={8}>
								<LeadDetails userInfo={userInfo} lead={lead} /*  main={main} setMain={setMain} mainHandler={mainHandler}*/ />
							</Col>
							<Col sm={12} md={4}>
								<Contact 
									lead={lead} 
									takeHandle={takeHandle} 
									modalShow={modalShow} 
									setModalShow={setModalShow} 
									ContactInfo={ContactInfo}
									setContactInfo={setContactInfo}
									onContactHandler={onContactHandler}
									phoneNumberHandler={phoneNumberHandler}
									alert={alert} 
									setAlert={setAlert}
									submitProcess={submitProcess}
								/>
								{/* <OtherLeads leads={leads} /> */}
							</Col>
						</Row>
					</Container>
				</section>
			</main>
		</Layout>
	);
};

// getstaticprops

export const getServerSideProps = async ctx => {
	const id = ctx.params.id;
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	/* const preFetchedOtherLeads = await preFetchOtherLeads(id); */
	const preFetchedLead = await preFetchLead(id);

	return { props: { userInfo, id, /* preFetchedOtherLeads,  */preFetchedLead } };
};

export default Lead;
