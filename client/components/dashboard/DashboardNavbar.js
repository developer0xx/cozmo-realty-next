import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import { logout } from '../../actions/auth';
import Modal from 'react-bootstrap/Modal';
import { Container, Row, Col, Button } from 'react-bootstrap';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

const ModalMenu = props => {
	const menus = props.menus;
	const userInfo = props.userInfo;
	return (
		<Modal {...props} aria-labelledby="contained-modal-title-vcenter" id="mobileNav">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					<Link href="/">
						<a className="navbar-brand justify-content-start w-100 mx-auto d-flex ">
							<Image src="/logos/cozmo_burgundy_horizontal.png" alt="Cozmo logo" quality={100} width={130} height={32} />
						</a>
					</Link>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="show-grid">
				<Container>
					<Row>
						{menus.map((menu, i) => {
							if (userInfo.role.includes(menu.role) || menu.role === 'all') {
								return (
									<Col xs={12} key={i} className={menu.order === 'last' ? `border-b-1 nav-item` : `nav-item`}>
										{menu.group ? <span className="group-title">{`${menu.group} Menu`}</span> : null}
										<Link href={`/dashboard/${menu.link}`}>
											<a className="">
												<span className="align-middle align-center">{menu.icon}</span>
												<span className="align-middle ml-4">{menu.menu}</span>
											</a>
										</Link>
									</Col>
								);
							}
						})}
						<Col className="nav-item" xs={12}>
							<span className="align-middle align-center ml-2px">
								<MeetingRoomIcon />
							</span>
							<span className="align-middle ml-4" onClick={() => logout().then(() => Router.replace(`/login`))}>
								Logout
							</span>
						</Col>
					</Row>
				</Container>
			</Modal.Body>
		</Modal>
	);
};

const DashboardNavbar = ({ userInfo, menus }) => {
	const [open, setOpen] = useState(false);
	return (
		<Container fluid>
			<nav id="dashboardNav" className="navbar navbar-light navbar-expand-md bg-faded justify-content-center">
				<button onClick={() => setOpen(true)} className="navbar-toggler " type="button" data-toggle="collapse" data-target="#collapsingNavbar3">
					<span className="navbar-toggler-icon"></span>
				</button>
				<ModalMenu show={open} onHide={() => setOpen(false)} menus={menus} userInfo={userInfo} />

				<Link href="/">
					<a className="navbar-brand justify-content-start w-50 mx-auto d-xs-none d-sm-none d-md-flex d-lg-flex">
						<Image src="/logos/cozmo_burgundy_horizontal.png" alt="Cozmo logo" quality={100} width={130} height={32} />
					</a>
				</Link>
				<Link href="/">
					<a className="navbar-brand justify-content-center w-50 mx-auto d-xs-flex d-sm-flex d-md-none d-lg-none">
						<Image src="/logos/cozmo_burgundy_horizontal.png" alt="Cozmo logo" quality={100} width={130} height={32} />
					</a>
				</Link>

				<div className="navbar-collapse collapse w-100" id="collapsingNavbar3">
					<ul className="navbar-nav w-100 justify-content-center">{/* <li className="nav-item active">
						<a className="nav-link" href="#">
							Link
						</a>
					</li>
					 */}</ul>
					<ul className="nav navbar-nav ml-auto w-100 justify-content-end">
						{/* <li className="nav-item ">
						{userInfo ? (
							<Dropdown>
								<Dropdown.Toggle id="dropdown-basic">
									{userInfo.image ? (
										<Image src={userInfo.image[0]} alt="User profile picture" className="user-profile-image" width={34} height={32} />
									) : (
										<Image src="/profile.png" alt="User profile picture" className="user-profile-image" width={34} height={32} />
									)}
								</Dropdown.Toggle>

								<Dropdown.Menu>
									<Dropdown.Item href="#" onClick={() => logout().then(() => Router.replace(`/login`))}>
										Logout
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						) : (
							<Link href="/login">
								<a className="nav-link">Login</a>
							</Link>
						)}
					</li> */}
					</ul>
				</div>
			</nav>


		</Container>
	);
};

export default DashboardNavbar;
