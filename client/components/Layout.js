import Navbar from './Navbar';
import Footer from './Footer';
import { Container, Row, Col } from 'react-bootstrap';

const Layout = ({ children, userInfo, style }) => {
	return (
		<>
			<Container id="layout" fluid>
				<Row>
					<Col className="p0">
						<Navbar style={style} userInfo={userInfo} />
						{children}
						<Footer />
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default Layout;
