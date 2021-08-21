import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Layout from '../../../components/Layout';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../../actions/auth';
import Link from 'next/link';

const Welcome = props => {
	const { userInfo } = props;
	return (
		<Layout userInfo={userInfo} style={'black'}>
			<section id="welcome-page">
				<Card className="card-border-disabled">
					<Card.Body>
						<Link href="/">
							<a>
								<Card.Img variant="top" className="form-logo" src="/logos/cozmo_black.png" />
							</a>
						</Link>
						<Card.Title as="h2" className="welcome-title">
							Welcome to Cozmo, {userInfo.firstName}
						</Card.Title>
						<Card.Text className="welcome-text">
							Thank you for joining Cozmo!
							<br />
							<br />
							Please send us the signed document and allow up to 2&nbsp;days for us to review.
							<br />
							You will be able to have a full access to the website once we verify your account.
							<br />
							<br />
							If you have any questions or concerns please contact us at :<br />
							<br />
							<span className="service-email">info@cozmorealty.com</span>
							<br />
							<br />
						</Card.Text>
						<Row>
							<Col xs={6}>
								<Link href="/mentor/mentorship">
									<a>
										<Button className="solid" size="lg" block>
											WANT TO BE MENTOR
										</Button>
									</a>
								</Link>
							</Col>
							<Col xs={6}>
								<Link href="/agent/mentorship">
									<a>
										<Button className="solid" size="lg" block>
											NEED MENTOR
										</Button>
									</a>
								</Link>
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</section>
		</Layout>
	);
};

export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	return { props: { userInfo } };
};

export default Welcome;
