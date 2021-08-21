import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import { logout } from '../actions/auth';
import Dropdown from 'react-bootstrap/Dropdown';
import { Container, Row, Col, Button } from 'react-bootstrap';
/* import { newLeadNotice } from '../components/utils/Socket.io'; */

const Navbar = props => {
	const currUser = props.userInfo;
	const black = 'navbar fixed-top navbar-expand-md navbar-dark bg-black main-nav';
	const transparent = 'navbar fixed-top navbar-expand-md navbar-dark bg-transparent main-nav';
	const background = props.style === 'black' ? black : transparent;
	let listner = null;
	const [scrollState, setScrollState] = useState(background);
	const [mobileWidth, setMobileWidth] = useState('hidden');
	const openNav = e => {
		e.preventDefault();
		setMobileWidth('visible');
	};
	const closeNav = e => {
		e.preventDefault();
		setMobileWidth('hidden');
	};
	if (props.style != 'black') {
		const router = useRouter();
		useEffect(() => {
			if (router.pathname === '/') {
				document.getElementsByTagName('body')[0].className = 'landing-page-layout';
			}
			listner = e => {
				var scrolled = document.scrollingElement.scrollTop;
				if (scrolled >= 120) {
					if (scrollState !== black) {
						setScrollState(black);
					}
				} else {
					if (scrollState !== transparent) {
						setScrollState(transparent);
					}
				}
			};
			document.addEventListener('scroll', listner);
			return () => {
				document.removeEventListener('scroll', listner);
			};
		}, [scrollState]);
	}

	return (
		<>
			<div id="mySidenav" className={`sidenav ${mobileWidth}`}>
				<button className="closebtn" onClick={closeNav}>
					&times;
				</button>
				<ul className="nav navbar-nav w-100">
					<li className="nav-item active">
						<Link href="/">
							<a className="nav-link">Home</a>
						</Link>
					</li>
					<li className="nav-item">
						<Link href="/#about">
							<a className="nav-link">About</a>
						</Link>
					</li>
					<li className="nav-item">
						<Link href="/#services">
							<a className="nav-link">Services</a>
						</Link>
					</li>
					<li className="nav-item">
						<Link href="/pocket-listings">
							<a className="nav-link">Leads</a>
						</Link>
					</li>
					<li className="nav-item">
						<Link href="/mentors">
							<a className="nav-link">Mentors</a>
						</Link>
					</li>
					<li className="nav-item">
						<Link href="/#contact">
							<a className="nav-link">Contact</a>
						</Link>
					</li>
					<Container>
						<Row>
							<Col>
								<hr />
								{currUser ? (
									<>
										<Row>
											<Col className="d-flex justify-content-center py-3">
												{currUser.image ? (
													<Image
														src={currUser.image[0]}
														alt="User profile picture"
														className="user-profile-image"
														quality={100}
														width={60}
														height={60}
														onError={e => (e.target.src = '/profile.png')}
													/>
												) : (
													<Image src="/profile.png" alt="User profile picture" className="user-profile-image" quality={100} width={60} height={60} />
												)}
											</Col>
										</Row>
										<Row>
											<Col className="d-flex flex-row">
												<Link href="/dashboard">
													<a className="mx-4">Dashboard</a>
												</Link>
												<Link href="/#">
													<a className="mx-4" onClick={() => logout().then(() => Router.replace(`/login`))}>
														Logout
													</a>
												</Link>
											</Col>
										</Row>
									</>
								) : (
									<Link href="/login">
										<a className="nav-link">Login</a>
									</Link>
								)}
							</Col>
						</Row>
					</Container>
				</ul>
			</div>
			<nav className={scrollState}>
				<div className="container">
					{/* <button onClick={openNav()} className="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse">
						<span className="navbar-toggler-icon"></span>
					</button> */}
					<button className="navbar-toggler" onClick={openNav}>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse w-100 justify-content-end">
						<ul className="nav navbar-nav w-auto ">
							<li className="nav-item active">
								<Link href="/">
									<a className="nav-link">Home</a>
								</Link>
							</li>
							<li className="nav-item">
								<Link href="/#about">
									<a className="nav-link">About</a>
								</Link>
							</li>
							<li className="nav-item">
								<Link href="/#services">
									<a className="nav-link">Services</a>
								</Link>
							</li>
						</ul>
					</div>
					<Link href="/">
						<a className="navbar-brand order-first nav-logo order-md-0 mx-0">
							<Image src="/logos/cozmo_white.png" alt="Cozmo white logo" quality={100} width={78.57} height={60} />
						</a>
					</Link>
					<div className="collapse navbar-collapse w-100">
						<ul className="nav navbar-nav w-auto">
							<li className="nav-item">
								<Link href="/pocket-listings">
									<a className="nav-link">Leads</a>
								</Link>
							</li>
							<li className="nav-item">
								<Link href="/#contact">
									<a className="nav-link">Contact</a>
								</Link>
							</li>
							<li className="nav-item my-account">
								{currUser ? (
									/*<Link href={'#'} onClick={() => logout().then(() => Router.replace(`/login`))}><a className="nav-link">Logout</a></Link>*/
									<Dropdown>
										<Dropdown.Toggle id="dropdown-basic">
											{currUser.image ? (
												<Image
													src={currUser.image[0]}
													alt="User profile picture"
													className="user-profile-image"
													width={34}
													height={32}
													onError={e => (e.target.src = '/profile.png')}
												/>
											) : (
												<Image src="/profile.png" alt="User profile picture" className="user-profile-image" width={34} height={32} />
											)}
										</Dropdown.Toggle>

										<Dropdown.Menu>
											<Dropdown.Item href="/dashboard/">Dashboard</Dropdown.Item>
											<Dropdown.Item href="/dashboard/my-account/">My Account</Dropdown.Item>
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
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</>
	);
};

export default Navbar;
