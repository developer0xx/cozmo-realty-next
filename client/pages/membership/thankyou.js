import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Layout from '../../components/Layout';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../actions/auth';
import Link from 'next/link';
import axios from 'axios';
import { API } from '../../config';

const Thankyou = props => {
	const { userInfo, InvoiceInfo } = props;
	const UnixDate = Unix => (Unix ? new Date(Unix * 1000).toLocaleDateString('en-US') : 'Invaild Date');

	return (
		<Layout userInfo={userInfo || {}} InvoiceInfo={InvoiceInfo || {}} style={'black'}>
			<section id="welcome-page">
				<Container>
					<Row className="mb-5">
						<Col>
							<h1>Thank you for subscribing.</h1>
							<h2>Invoice {InvoiceInfo.id} </h2>
						</Col>
					</Row>
					<Row className="mb-5">
						<Col className="text-left">
							<span className="d-block strong">AMOUNT PAID</span>
							<span>$ {InvoiceInfo.amount_paid / 100}</span>
						</Col>
						<Col>
							<span className="d-block strong">DATE PAID</span>
							<span>{UnixDate(InvoiceInfo?.date)}</span>
						</Col>
						<Col className="text-right ">
							<span className="d-block strong">PAYMENT METHOD</span>
							<span>
								{InvoiceInfo.charge?.source.brand} - {InvoiceInfo.charge?.source.last4}{' '}
							</span>
						</Col>
					</Row>
					<Row className="my-3"></Row>
					<Row className="mb-5 ">
						<Col className="text-left">
							<span className="strong text-left">SUMMARY</span>
							<Row className="summary p-4 my-2">
								<Col>
									<Row className="my-2">
										<Col className="text-left">
											<span>JAN 1, 2021 - UNTIL CANCELLED</span>
										</Col>
									</Row>
									<Row className="my-2">
										<Col className="text-left strong">
											<span>Product Name</span>
										</Col>
										<Col className="text-right">
											<span>$ {InvoiceInfo.amount_paid / 100}</span>
										</Col>
									</Row>
									<Row className="my-2">
										<Col className="text-left strong">
											<span>Amount paid</span>
										</Col>
										<Col className="text-right">
											<span>${InvoiceInfo.amount_paid / 100}</span>
										</Col>
									</Row>
								</Col>
							</Row>
							<Row className="mt-4">
								<Col className="text-left">
									<span>
										<a href={InvoiceInfo.invoice_pdf}>Download as PDF</a>
									</span>
								</Col>
							</Row>
						</Col>
					</Row>

					<hr className="my-5"></hr>
					<Row>
						<Col className="text-left">
							<span>
								If you have any question, contact Cozmo Realty at <a href="mailto:info@cozmorealty.com">info@cozmorealty.com</a> or call at{' '}
								<a href="tel:888-887-3711">888-887-3711</a>
							</span>
						</Col>
					</Row>
					<hr className="my-5"></hr>

					<Row>
						<Col>
							<Link href="/leads">
								<a>
									<Button className="solid solid-small w-100">Check fresh leads</Button>
								</a>
							</Link>
						</Col>
						<Col>
							<Link href="/dashboard/agent/membership">
								<a>
									<Button className="solid solid-small w-100">Check subscription status</Button>
								</a>
							</Link>
						</Col>
					</Row>
				</Container>
			</section>
		</Layout>
	);
};
const getInvoiceInfo = async (id, cookieHeader) => {
	return await axios({
		method: 'POST',
		url: `${API}/stripe/invoice`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			cookie: cookieHeader,
		},
		data: { invoiceID: id },
		withCredentials: true,
	})
		.then(d => {
			if (!d.data || !d.data.success) {
				console.log('===error====', d.data);
				return {};
			}
			console.log('client/pages/membership/thankyou.js--------------104:', d.data);
			return d.data.invoice || {};
		})
		.catch(e => {
			console.log('===error====', e);
			return {};
		});
};
export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	const InvoiceInfo = await getInvoiceInfo(ctx.query.id, cookieHeader);
	return { props: { userInfo, InvoiceInfo } };
};

export default Thankyou;
