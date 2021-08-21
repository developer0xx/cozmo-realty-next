import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import Layout from '../components/Layout';
import Head from 'next/head';

const useStyles = makeStyles(theme => ({
	main: {
		marginTop: '4rem',
		marginBottom: '4rem',
	},
	heading: {
		fontSize: '16pt',
		fontWeight: 500,
	},
	image: {
		width: '100%',
	},
	investorsImgWrapper: {
		width: '100%',
		textAlign: 'center',
		marginBottom: '1rem',
		marginTop: '3rem',
	},
	processImage: {
		margin: 'auto',
	},
	processImgWrapper: {
		width: '100%',
		textAlign: 'center',
		marginBottom: '3rem',
	},
	paperWrapper: {
		marginBottom: '3rem',
	},
	paper: {
		textAlign: 'center',
		padding: '20px',
		color: '#676767',
		fontWeight: 500,
		height: '100%',
		boxShadow: 0,
		border: '1px solid #ccc',
	},
	numbering: {
		fontSize: '14pt',
		fontWeight: '600',
	},
	processDescription: {
		color: '#676767',
	},
}));

const Accordion = withStyles({
	root: {
		border: '1px solid rgba(0, 0, 0, .125)',
		boxShadow: 'none',
		'&:first-child': {
			borderTopRadius: '4px',
		},
		'&:last-child': {
			borderBottomRadius: '4px',
		},
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
		'&$expanded': {
			margin: 'auto',
		},
	},
	expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
	root: {
		borderBottom: '1px solid rgba(0, 0, 0, .125)',
		marginBottom: -1,
		minHeight: 56,
		'&$expanded': {
			minHeight: 56,
		},
	},
	content: {
		'&$expanded': {
			margin: '12px 0',
		},
	},
	expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles(theme => ({
	root: {
		padding: '15px 40px',

		'& ul': {
			padding: 0,
			fontSize: '1rem',
			fontWeight: 400,
			lineHeight: 1.5,
			'& li': {
				'&:not(:last-child)': {
					marginBottom: '10px',
				},
			},
		},
	},
}))(MuiAccordionDetails);

const AboutUs = () => {
	const classes = useStyles();

	return (
		<Layout>
			<Head>
				<meta charSet="utf-8" />
				<title>About us - Champion Lenders</title>
				<link rel="canonical" href="https://championlenders.com/about-us/" />
				<meta property="og:locale" content="en_US" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="About Us - Champion Lenders" />
				<meta
					property="og:description"
					content="The mission of Champion Lenders is to provide investors and beneficiaries with the best possible trust deed investment opportunities. We can bring you the best deals in high return investment funds, commercial real estate loans, and investment properties in California."
				/>
				<meta property="og:url" content="/about-us/" />
				<meta property="og:site_name" content="Champion Lenders" />
				<meta property="og:image" content="/about/ezgif.com-webp-to-jpg.jpg" />
				<meta property="og:image" content="https://championlenders.com/og_championlenders.png" />
			</Head>
			<Container component="main" className={classes.main}>
				<Grid container direction="row" justify="center" alignItems="flex-start">
					<Grid item md={10} lg={10}>
						<Grid container component="section" id="investors" spacing={2}>
							<Grid item xs={12}>
								<Typography component="h1" variant="h4">
									Investors
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<p>
									The mission of Champion Lenders is to provide investors and beneficiaries with the best possible trust deed investment opportunities. We can
									bring you the best deals in high return investment funds, commercial real estate loans, and investment properties in California.
									<br />
									<br />
									All income goes directly to you with the borrower paying all interest.
								</p>
							</Grid>
							<Grid item xs={12}>
								<img className={classes.image} alt="Investor" src="/about/ezgif.com-webp-to-jpg.jpg" />
							</Grid>
						</Grid>
						<Grid container component="section" id="how-we-differ" spacing={2}>
							<Grid item xs={12}>
								<Typography component="h1" variant="h4">
									THE CHAMPION LENDERS DIFFERENCE
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Accordion>
									<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
										<Typography className={classes.heading}>See how we are different</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<ul>
											<li>The escrow officer oversees closing of the transaction.</li>
											<li>Escrow and Title insurance is ordered with every transaction.</li>
											<li>
												If the borrower does get behind, we provide the our own leading foreclosure service, Stallion Foreclosure Service, Inc., to step in
												and conduct and complete the foreclosure process to make it hassle free for the investor(s).​
											</li>
											<li>
												Investor/Beneficiary will receive all documentation pertinent to file (1003 form, credit report, appraisal, preliminary title
												report, escrow instructions, lease agreements, income documents, etc.)
											</li>
											<li>Investor/Beneficiary have the ability to service their own loan.</li>
											<li>We only lend on non-owner occupied and commercial real estate in California, keeping all properties close.</li>
										</ul>
									</AccordionDetails>
								</Accordion>
							</Grid>
						</Grid>
						<Grid container compoent="section" id="process">
							<Grid item xs={12}>
								<img className={classes.image} alt="Process" src="/about/Our-Process.png" />
							</Grid>
							<Grid item xs={12}>
								<Typography component="h1" variant="h4">
									Our Process
								</Typography>
							</Grid>
							<Grid container>
								<Grid item className={classes.paperWrapper} xs={12} sm={3}>
									<Paper className={classes.paper}>
										<h5 className={classes.numbering}>1.</h5>
										<span className={classes.processDescription}>INVESTORS PURCHASE SHARES FOR EACH PROJECT</span>
									</Paper>
								</Grid>
								<Grid item className={classes.paperWrapper} xs={12} sm={3}>
									<Paper className={classes.paper}>
										<h5 className={classes.numbering}>2.</h5>
										<span className={classes.processDescription}>CHAMPION&nbsp;LENDERS LENDS MONEY TO BORROWERS AND SECURES PROPERTY AS COLLATERAL</span>
									</Paper>
								</Grid>
								<Grid item className={classes.paperWrapper} xs={12} sm={3}>
									<Paper className={classes.paper}>
										<h5 className={classes.numbering}>3.</h5>
										<span className={classes.processDescription}>BORROWERS PAY MONTHLY INTEREST</span>
									</Paper>
								</Grid>
								<Grid item className={classes.paperWrapper} xs={12} sm={3}>
									<Paper className={classes.paper}>
										<h5 className={classes.numbering}>4.</h5>
										<span className={classes.processDescription}>INVESTORS RECEIVE MONTHLY CASH DISTRIBUTIONS</span>
									</Paper>
								</Grid>
							</Grid>
							<Grid item xs={12}>
								<Typography component="h1" variant="h4">
									Investor's Own Process
								</Typography>
							</Grid>
							<Grid container>
								<Grid item className={classes.paperWrapper} xs={12} sm={4}>
									<Paper className={classes.paper}>
										<h5 className={classes.numbering}>1.</h5>
										<span className={classes.processDescription}>INVESTORS HAVE THE ABILITY TO SERVICE THEIR OWN LOAN (COVERED BY TITLE INSURANCE)</span>
									</Paper>
								</Grid>
								<Grid item className={classes.paperWrapper} xs={12} sm={4}>
									<Paper className={classes.paper}>
										<h5 className={classes.numbering}>2.</h5>
										<span className={classes.processDescription}>INVESTORS LEND MONEY TO BORROWERS AND SECURES PROPERTY AS COLLATERAL</span>
									</Paper>
								</Grid>
								<Grid item className={classes.paperWrapper} xs={12} sm={4}>
									<Paper className={classes.paper}>
										<h5 className={classes.numbering}>3.</h5>
										<span className={classes.processDescription}>BORROWERS PAY MONTHLY INTEREST DIRECTLY TO INVESTOR</span>
									</Paper>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Container>
		</Layout>
	);
};

export default AboutUs;
