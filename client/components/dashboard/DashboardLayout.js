import { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import { Container, Row, Col } from 'react-bootstrap';
import DashboardNavbar from './DashboardNavbar';
import PersonIcon from '@material-ui/icons/Person';
import DashboardIcon from '@material-ui/icons/Dashboard';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PeopleIcon from '@material-ui/icons/People';
import WorkIcon from '@material-ui/icons/Work';
import DescriptionIcon from '@material-ui/icons/Description';
import CardMembershipIcon from '@material-ui/icons/CardMembership';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
const DashboardLayout = ({ children, userInfo }) => {
	const [menuLabel, setMenuLabel] = useState('block');
	const menus = [
		{ menu: 'dashboard', link: '', role: 'all', icon: <DashboardIcon />, group: 'user' },
		{ menu: 'referral', link: 'user/referral', role: 'all', icon: <GroupAddIcon /> },
		{ menu: 'my account', link: 'my-account', role: 'all', icon: <PersonIcon />, order: 'last' },
		{ menu: 'users', link: 'admin/users', role: 'admin', icon: <PeopleIcon />, group: 'admin' },
		{ menu: 'pocket listing', link: 'admin/pocket-listing', role: 'admin', icon: <DescriptionIcon /> },
		{ menu: 'active listing', link: 'admin/active-listing', role: 'admin', icon: <DescriptionIcon /> },
		{ menu: 'in house leads', link: 'admin/in-house-leads', role: 'admin', icon: <DescriptionIcon /> },
		{ menu: 'ai verified leads', link: 'admin/ai-verified-leads', role: 'admin', icon: <DescriptionIcon /> },
		{ menu: 'buyers', link: 'admin/buyers', role: 'admin', icon: <DescriptionIcon /> },
		{ menu: 'claims', link: 'admin/claims', role: 'admin', icon: <DescriptionIcon />, order: 'last' },
		{ menu: 'pocket listing', link: 'agent/pocket-listing', role: 'agent', icon: <DescriptionIcon />, group: 'agent' },
		{ menu: 'active listing', link: 'agent/active-listing', role: 'agent', icon: <DescriptionIcon /> },
		{ menu: 'in house leads', link: 'agent/in-house-leads', role: 'agent', icon: <DescriptionIcon /> },
		{ menu: 'ai verified leads', link: 'agent/ai-verified-leads', role: 'agent', icon: <DescriptionIcon /> },
		{ menu: 'buyers', link: 'agent/buyers', role: 'agent', icon: <DescriptionIcon /> },
		{ menu: 'claims', link: 'agent/claims', role: 'agent', icon: <DescriptionIcon />, order: 'last' },

	];
	return (
		<div className="w-100 d-flex">
			<DashboardSidebar menus={menus} userInfo={userInfo} menuLabel={menuLabel} setMenuLabel={setMenuLabel} />
			<div id="body" className="w-100">
				<DashboardNavbar userInfo={userInfo} menus={menus}></DashboardNavbar>
				{children}
			</div>
		</div>
	);
};

export default DashboardLayout;
