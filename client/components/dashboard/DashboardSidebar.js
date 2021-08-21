import { Nav } from 'react-bootstrap';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import Dropdown from 'react-bootstrap/Dropdown';
import Link from 'next/link';
import Router from 'next/router';
import { logout } from '../../actions/auth';
import Image from 'next/image';

const DashboardSidebar = ({ userInfo, menuLabel, setMenuLabel, menus }) => {
	// const toggle = () => {
	// 	if (menuLabel == 'hide') {
	// 		setMenuLabel('block');
	// 	} else {
	// 		setMenuLabel('hide');
	// 	}
	// };
	return (
		<>
			<Nav className={`d-xs-none d-sm-none d-md-block d-lg-block bg-light sidebar  ${menuLabel}`}>
				{/* <Nav.Item onClick={toggle} id="menu-toggle">
					<span>
						<MenuIcon />
					</span>

					 <button className="" id="menu-toggle">
						<MenuIcon onClick={toggle} />
					</button>
				</Nav.Item> */}
				{menus.map((menu, i) => {
					if (userInfo.role.includes(menu.role) || menu.role === 'all') {
						return (
							<div key={i}>
								{menu.group ? <span className="group-title">{`${menu.group} Menu`}</span> : null}
								<Nav.Item className={menu.order === 'last' ? 'border-b-1' : null}>
									<Nav.Link href={`/dashboard/${menu.link}`}>
										<span className="align-middle align-center">{menu.icon}</span>
										<span className={`align-middle ml-4 ${menuLabel}`}>{menu.menu}</span>
									</Nav.Link>
								</Nav.Item>
							</div>
						);
					}
				})}
				<div className="profile">
					<Link href="/dashboard/my-account">
						<a>
							<Image src={userInfo.image ? userInfo.image[0] : '/profile.png'} alt="User profile picture" className="user-profile-image" width={34} height={32} />
						</a>
					</Link>

					<span className="d-block" onClick={() => logout().then(() => Router.replace(`/login`))}>
						Logout
					</span>
				</div>
			</Nav>
		</>
	);
};

export default DashboardSidebar;
