import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { isAuth } from '../../actions/auth';

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

// address, reqLoanAmount, term, desInterestRate, status

const headCells = [
	{
		id: 'address',
		numeric: false,
		disablePadding: true,
		label: 'Address',
	},
	{
		id: 'reqLoanAmount',
		align: 'right',
		numeric: true,
		disablePadding: false,
		label: 'Req. Loan Amount ($)',
	},
	{
		id: 'term',
		align: 'center',
		numeric: true,
		disablePadding: false,
		label: 'Term (Yr)',
	},
	{
		id: 'desInterestRate',
		align: 'center',
		disablePadding: false,
		label: 'Interest (%)',
	},
	{
		id: 'status',
		align: 'center',
		disablePadding: false,
		label: 'Status',
	},
];

const RequestsPageHead = props => {
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
						align={headCell.align}
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

const RequestsPageToolbar = props => {
	const classes = useToolbarStyles();
	const { numSelected } = props;
	const { selected } = props;

	const deleteHandler = (event, selected) => {
		axios.put('/api/property/put/properties/', selected).then(response => {
			if (response.data.success) {
				window.location.reload();
			} else {
				alert('Failed to delete property');
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
					My Requests
				</Typography>
			)}

			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton aria-label="delete">
						<DeleteIcon onClick={event => deleteHandler(event, selected)} />
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

const MyRequestList = () => {
	const classes = useStyles();
	const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState('calories');
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [dense, setDense] = useState(false);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [rows, setRows] = useState([]);
	const [currentUserData, setCurrentUserData] = useState();

	// useEffect(() => {
	// 	if (currentUserData._id) {
	// 		axios.get(`/api/property/get/user/properties/${currentUserData._id}`).then(res => {
	// 			if (res.data.success) {
	// 				setRows(
	// 					res.data.properties
	// 						.map((property, i) => ({
	// 							address: `${property.property.streetAddress} ${property.property.streetAddress2nd} ${property.property.city} ${property.property.state} ${property.property.zip}`,
	// 							reqLoanAmount: property.reqLoanAmount,
	// 							term: property.term,
	// 							desInterestRate: property.desInterestRate,
	// 							status: property.status,
	// 							id: property._id,
	// 						}))
	// 						.reverse()
	// 				);
	// 			} else {
	// 				alert('Failed to fetch property datas');
	// 			}
	// 		});
	// 	}
	// }, [currentUserData._id]);

	// address, reqLoanAmount, term, desInterestRate, status

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = event => {
		if (event.target.checked) {
			const newSelecteds = rows.map((n, index) => index);
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

	const handleChangeDense = event => {
		setDense(event.target.checked);
	};

	const isSelected = index => selected.indexOf(index) !== -1;

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	const priceTag = price => {
		if (price) {
			let numDec = price.toString().length;
			let numArr = Array.from(price.toString());
			let numFormat = [];
			for (let x = 0; x < numDec; x++) {
				if (x % 3 === 0 && x !== 0) {
					numFormat.unshift(',');
				}
				numFormat.unshift(numArr[numDec - x - 1]);
			}
			return numFormat.join('');
		} else {
			return 0;
		}
	};
	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<RequestsPageToolbar numSelected={selected.length} selected={selected} />
				<TableContainer>
					<Table className={classes.table} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'} aria-label="enhanced table">
						<RequestsPageHead
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
									const isItemSelected = isSelected(row.id);
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={row.id} selected={isItemSelected}>
											<TableCell padding="checkbox">
												<Checkbox
													checked={isItemSelected}
													inputProps={{
														'aria-labelledby': labelId,
													}}
													onClick={event => handleClick(event, row.id)}
												/>
											</TableCell>
											{/* address, reqLoanAmount, term, desInterestRate, status */}

											<TableCell component="th" id={labelId} scope="row" padding="none">
												<Link to={`/dashboard/userPropertyEdit/${row.id}`}>{row.address}</Link>
											</TableCell>
											<TableCell align="right">$ {priceTag(row.reqLoanAmount)}</TableCell>
											<TableCell align="center">{row.term}</TableCell>
											<TableCell align="center">{row.desInterestRate}</TableCell>
											<TableCell align="center">{row.status}</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow
									style={{
										height: (dense ? 33 : 53) * emptyRows,
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
			<FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
		</div>
	);
};

export default MyRequestList;
