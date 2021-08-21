import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
	spinPage: {
		height: 'calc(100vh - 4rem)',
		paddingTop: '4rem',
		textAlign: 'center',
		position: 'relative',
	},
	spinnerIcon: {
		position: 'absolute',
		top: 'calc(50% - 20px)',
	},
}));

const Spinner = () => {
	const classes = useStyles();

	return (
		<div className={classes.spinPage}>
			<CircularProgress className={classes.spinnerIcon} />
		</div>
	);
};

export default Spinner;
