import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../actions/auth';

const selectRole = ({ userInfo }) => {
	return (
		<Layout userInfo={userInfo} style={'black'}>
			<Container fluid id="agent-roles">
				<Row className="form-paper">
					<h1 className="form-title">I am...</h1>
					<Col className="form-input p0 mt-3">
						<Link href={`/register/agents`}>
							<a>
								<Button size="lg" block className="solid">Agent</Button>
							</a>
						</Link>
					</Col>
					<Col className="form-input p0 mt-3">
						<Link href={`/register/coldcaller`}>
							<a>
								<Button size="lg" block className="solid">Cold Caller</Button>
							</a>
						</Link>
					</Col>
					<Col className="form-input p0 mt-3">
						<Link href={`/register/customer`}>
							<a>
								<Button size="lg" block className="solid">Customer</Button>
							</a>
						</Link>
					</Col>
				</Row>
			</Container>
		</Layout>
	)
}

export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);

	return { props: { userInfo } };
};

export default selectRole;
