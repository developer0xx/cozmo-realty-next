import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';

const index = ({ id }) => {
	return <div>{id}</div>;
};

index.getInitialProps = async ({ query }) => {
	const { id } = query;

	return { id };
};

export default index;
