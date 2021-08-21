import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/styles';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
const theme = responsiveFontSizes(createMuiTheme());

class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					<meta charSet="UTF-8" />
					<meta name="theme-color" content={theme.palette.primary.main} />
					<link
						rel="stylesheet"
						id="redux-google-fonts-salient_redux-css"
						href="https://fonts.googleapis.com/css?family=Roboto%3A500%2C700%7CNunito%3A300%2C700%7CHeebo%3A400%7CPoppins%3A400%7CNoto+Sans%3A700%2C400italic&amp;subset=latin&amp;ver=1607571549"
						type="text/css"
						media="all"
					/>
					<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
MyDocument.getInitialProps = async ctx => {
	// Render app and page and get the context of the page with collected side effects.
	const sheets = new ServerStyleSheets();
	const originalRenderPage = ctx.renderPage;

	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: App => props => sheets.collect(<App {...props} />),
		});

	const initialProps = await Document.getInitialProps(ctx);

	return {
		...initialProps,
		// Styles fragment is rendered after the app and page rendering finish.
		styles: [
			<React.Fragment key="styles">
				{initialProps.styles}
				{sheets.getStyleElement()}
			</React.Fragment>,
		],
	};
};

export default MyDocument;
