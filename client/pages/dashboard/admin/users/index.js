import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
// import { Redirect, Link } from 'react-router-dom';
import Link from 'next/link';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../../../actions/auth';
import { API } from '../../../../config';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import PostAddIcon from '@material-ui/icons/PostAdd';

const descendingComparator = (a, b, orderBy) => {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
};

const getComparator = (order, orderBy) => {
	return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
};

// id, email, firstName, lastName, role

const headCells = [
	{
		id: 'email',
		numeric: false,
		disablePadding: false,
		label: 'Email Address',
	},
	{
		id: 'firstName',
		numeric: false,
		disablePadding: false,
		label: 'First Name',
	},
	{
		id: 'lastName',
		numeric: false,
		disablePadding: false,
		label: 'Last Name',
	},
	{
		id: 'role',
		numeric: false,
		disablePadding: false,
		label: 'Role',
	},
];

const UsersHead = props => {
	const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
	const createSortHandler = property => event => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							'aria-label': 'select all desserts',
						}}
					/>
				</TableCell>
				{headCells.map(headCell => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'default'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={createSortHandler(headCell.id)}>
							{headCell.label}
							{orderBy === headCell.id ? <span className={classes.visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span> : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
};

const useToolbarStyles = makeStyles(theme => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	highlight:
		theme.palette.type === 'light'
			? {
					color: theme.palette.secondary.main,
					backgroundColor: lighten(theme.palette.secondary.light, 0.85),
			  }
			: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark,
			  },
	title: {
		flex: '1 1 100%',
	},
}));

const UsersToolbar = props => {
	const classes = useToolbarStyles();
	const { numSelected, selected, rows, handleRoleFilter, currButton } = props;

	const deleteHandler = async (event, selected) => {
		let body = new Object({
			list: [],
		});
		for (let i = 0; i < selected.length; i++) {
			await body.list.push(rows[selected[i]]._id);
		}
		await axios({
			method: 'DELETE',
			url: `${API}/leads/coldcaller/delete/leads`,
			withCredentials: true,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			data: body,
		}).then(response => {
			if (response.data.success) {
				Router.reload(window.location.pathname);
			} else {
				console.log('Failed to delete property');
			}
		});
	};
	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected > 0,
			})}
		>
			{numSelected > 0 ? (
				<Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
					{numSelected} selected
				</Typography>
			) : (
				<Typography className={classes.title} variant="h6" id="tableTitle" component="div">
					Users
				</Typography>
			)}
			<button className={`${currButton === 'all' ? 'active' : ''} btn btn-outline-dark`} onClick={e => handleRoleFilter()}>
				All
			</button>
			<button className={`${currButton === 'admin' ? 'active' : ''} btn btn-outline-dark`} onClick={e => handleRoleFilter('admin')}>
				Admin
			</button>
			<button className={`${currButton === 'mentor' ? 'active' : ''} btn btn-outline-dark`} onClick={e => handleRoleFilter('mentor')}>
				Mentor
			</button>
			<button className={`${currButton === 'agent' ? 'active' : ''} btn btn-outline-dark`} onClick={e => handleRoleFilter('agent')}>
				Agent
			</button>
			<button className={`${currButton === 'customer' ? 'active' : ''} btn btn-outline-dark`} onClick={e => handleRoleFilter('customer')}>
				Customer
			</button>
			{numSelected > 0 ? (
				<Tooltip title="Delete" onClick={event => deleteHandler(event, selected)}>
					<IconButton aria-label="delete">
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title="Filter list">
					<IconButton aria-label="filter list">
						<FilterListIcon />
					</IconButton>
				</Tooltip>
			)}
		</Toolbar>
	);
};

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2),
	},
	table: {
		minWidth: 750,
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1,
	},
}));

const fetchUsers = async role => {
	return await axios.get(`${API}/users/get/users/${role}`).then(res => {
		if (res.data.success) {
			return res.data.users.map((user, i) => ({
				id: i + 1,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
				uid: user._id,
			}));
		} else {
			console.log('Failed to fetch users');
		}
	});
};

const Users = ({ users, userInfo }) => {
	const classes = useStyles();
	const [rows, setRows] = useState(users);
	const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState('calories');
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [currButton, setCurrButton] = useState('all');
	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = event => {
		if (event.target.checked) {
			const newSelecteds = rows.map((row, index) => index);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, index) => {
		const selectedIndex = selected.indexOf(index);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, index);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleRoleFilter = async role => {
		if (role === undefined) {
			setCurrButton('all');
		} else {
			setCurrButton(role);
		}
		setRows(await fetchUsers(role));
		setSelected([]);
	};
	const isSelected = index => selected.indexOf(index) !== -1;
	const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	return (
		<DashboardLayout userInfo={userInfo}>
			<div className={classes.root} id="board">
				<Paper className={classes.paper}>
					<UsersToolbar handleRoleFilter={handleRoleFilter} numSelected={selected.length} selected={selected} rows={rows} currButton={currButton} />
					<TableContainer>
						<Table className={classes.table} aria-labelledby="tableTitle" size="small" aria-label="enhanced table">
							<UsersHead
								classes={classes}
								numSelected={selected.length}
								order={order}
								orderBy={orderBy}
								onSelectAllClick={handleSelectAllClick}
								onRequestSort={handleRequestSort}
								rowCount={rows.length}
							/>
							<TableBody>
								{stableSort(rows, getComparator(order, orderBy))
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row, index) => {
										const isItemSelected = isSelected(index);
										const labelId = `enhanced-table-checkbox-${index}`;
										return (
											<TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={row._id} selected={isItemSelected} key={labelId}>
												<TableCell padding="checkbox">
													<Checkbox
														checked={isItemSelected}
														inputProps={{
															'aria-labelledby': labelId,
														}}
														onClick={event => handleClick(event, index)}
													/>
												</TableCell>

												<Link href={`/dashboard/admin/users/update/${row.uid}`}>
													<TableCell align="left">
														<a>
															<span>{row.email}</span>
														</a>
													</TableCell>
												</Link>
												<Link href={`/dashboard/admin/users/update/${row.uid}`}>
													<TableCell align="left">
														<a>
															<span>{row.firstName}</span>
														</a>
													</TableCell>
												</Link>
												<Link href={`/dashboard/admin/users/update/${row.uid}`}>
													<TableCell align="left">
														<a>
															<span>{row.lastName}</span>
														</a>
													</TableCell>
												</Link>
												<Link href={`/dashboard/admin/users/update/${row.uid}`}>
													<TableCell align="left" className="board-col">
														<a>
															<span>{row.role.join(', ')}</span>
														</a>
													</TableCell>
												</Link>
											</TableRow>
										);
									})}
								{emptyRows > 0 && (
									<TableRow
										style={{
											height: 33 * emptyRows,
										}}
									>
										<TableCell colSpan={6} />
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[10, 20, 50]}
						component="div"
						count={rows.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onChangePage={handleChangePage}
						onChangeRowsPerPage={handleChangeRowsPerPage}
					/>
				</Paper>
			</div>
		</DashboardLayout>
	);
};

export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	const users = await fetchUsers();
	return { props: { userInfo, users } };
};

export default Users;
