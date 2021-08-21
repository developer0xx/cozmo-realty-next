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
import { getUserInfoSSR } from '../../../actions/auth';
import { API } from '../../../config';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import PostAddIcon from '@material-ui/icons/PostAdd';
import EjectIcon from '@material-ui/icons/Eject';

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

const headCells = [
	{
		id: 'adress',
		numeric: false,
		disablePadding: false,
		label: 'Address',
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
		id: 'phone',
		numeric: false,
		disablePadding: false,
		label: 'phone',
	},
	{
		id: 'status',
		disablePadding: false,
		label: 'Status',
		align: 'center',
	},
];

const Head = props => {
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

const LeadsToolbar = props => {
	const classes = useToolbarStyles();
	const { numSelected } = props;
	const { selected } = props;
	const { rows } = props;

	const deleteHandler = async (event, selected) => {
		let body = new Object({
			list: [],
		});

		for (let i = 0; i < selected.length; i++) {
			await body.list.push(rows[selected[i]]._id);
		}
		await axios({
			method: 'DELETE',
			url: `${API}/leads/admin/delete/leads`,
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

	const ReleaseHandler = async (event, selected) => {
		let body = new Object({
			list: [],
		});

		for (let i = 0; i < selected.length; i++) {
			await body.list.push(rows[selected[i]]._id);
		}
		await axios({
			method: 'PUT',
			url: `${API}/leads/release/leads`,
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
					Leads
				</Typography>
			)}
			<Tooltip title="Add new lead">
				<div>
					<Link href="/dashboard/coldcaller/leads/create">
						<a>
							<IconButton aria-label="Add new lead">
								<PostAddIcon />
							</IconButton>
						</a>
					</Link>
				</div>
			</Tooltip>
			{numSelected > 0 ? (
				<>
					<Tooltip title="Delete" onClick={event => ReleaseHandler(event, selected)}>
						<IconButton aria-label="Release Lead">
							<EjectIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Delete" onClick={event => deleteHandler(event, selected)}>
						<IconButton aria-label="delete">
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</>
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

const fetchLeads = async () => {
	return await axios.get(`${API}/leads/admin/get/all/`, { withCredentials: true }).then(res => {
		if (res.data && res.data.success) {
			return res.data.leads;
		} else {
			return null;
		}
	});
};

const Leads = ({ rows, userInfo }) => {
	const classes = useStyles();
	const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState('calories');
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	// const properties = rows.property;
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

	const isSelected = index => selected.indexOf(index) !== -1;
	const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	return (
		<DashboardLayout userInfo={userInfo}>
			<div className={classes.root}>
				<Paper className={classes.paper}>
					<LeadsToolbar numSelected={selected.length} selected={selected} rows={rows} />
					<TableContainer>
						<Table className={classes.table} aria-labelledby="tableTitle" size="small" aria-label="enhanced table">
							<Head
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
												<Link href={`/dashboard/coldcaller/leads/update/${row._id}`}>
													<TableCell align="left">
														<a>
															<span>{row.property.streetAddress}</span>
														</a>
													</TableCell>
												</Link>
												<Link href={`/dashboard/coldcaller/leads/update/${row._id}`}>
													<TableCell align="left">
														<a>
															<span>{row.firstName}</span>
														</a>
													</TableCell>
												</Link>
												<Link href={`/dashboard/coldcaller/leads/update/${row._id}`}>
													<TableCell align="left">
														<a>
															<span>{row.lastName}</span>
														</a>
													</TableCell>
												</Link>
												<Link href={`/dashboard/coldcaller/leads/update/${row._id}`}>
													<TableCell align="left">
														<a>
															<span>{row.phoneNumber}</span>
														</a>
													</TableCell>
												</Link>
												<Link href={`/dashboard/coldcaller/leads/update/${row._id}`}>
													<TableCell align="center">
														<a>
															<span>{row.status}</span>
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
	const rows = await fetchLeads();
	return { props: { userInfo, rows } };
};

export default Leads;
