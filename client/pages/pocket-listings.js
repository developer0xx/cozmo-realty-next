import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Head from 'next/head';
import Properties from '../components/pocket-listings/Properties';
import Maps from '../components/pocket-listings/Maps';
import SearchBar from '../components/pocket-listings/SearchBar';
import useHistoryState from '../components/utils/useHistoryState';

import { Container, Row, Col } from 'react-bootstrap';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../actions/auth';
import axios from 'axios';
import { API } from '../config';
import useResize from '../components/utils/useResize';

const fetchLeads = async () => {
	return await axios.get(`${API}/pockets`).then(res => {
		if (res.data && res.data.success) {
			return res.data.currentProperties;
		} else {
			return null;
		}
	});
};

const Leads = ({ userInfo, pockets }) => {
	const [PostSize, setPostSize] = useHistoryState(0, 'PostSize');
	const [properties, setProperties] = useHistoryState([], 'properties');
	const [nearbyProperties, setNearbyProperties] = useHistoryState([], 'nearbyProperties');
	const [totalCount, setTotalCount] = useHistoryState(0, 'totalCount');
	const [propHover, setPropHover] = useHistoryState(false, 'propHover');
	const [propClick, setPropClick] = useHistoryState(null, 'propClick');
	const [cityList, setCityList] = useHistoryState([], 'cityList');
	const [search, setSearch] = useHistoryState(
		{
			requested: false,
			city: '',
			purpose: '',
			propertyType: ''
		},
		'search'
	);
	const [mapBounds, setMapBounds] = useHistoryState(
		{
			ne: { lat: 34.32288410889255, lng: -117.903106828125 },
			nw: { lat: 34.32288410889255, lng: -118.584259171875 },
			se: { lat: 33.78071908966692, lng: -117.903106828125 },
			sw: { lat: 33.78071908966692, lng: -118.584259171875 },
		},
		'mapBounds'
	);
	const [Center, setCenter] = useHistoryState(
		{
			lat: 34.5414563,
			lng: -118.6166781,
		},
		'Center'
	);

	const [cityText, setCityText] = useHistoryState('', 'cityText');

	const router = useRouter();

	const bodyRef = useRef();
	const { width } = useResize(bodyRef);

	const findFromArray = (arr, cityName) => {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === cityName) {
				return true;
			}
		}
		return false;
	};

	const getProperties = (status, custom) => {
		let variables = {
			limit: 20,
			totalCount,
			...search,
		};

		if (status === 'search') {
			setProperties([]);
			setNearbyProperties([]);
			setPostSize('');
			setTotalCount('');
			variables = {
				...variables,
				requested: true,
			};
			if (!search.city && cityText) {
				variables.city = cityText;
			}
			if (custom && Object.keys(custom).length > 0) {
				variables = {
					...variables,
					...custom
				}
			}
		}
		axios.get(`${API}/pockets`, { params: variables }).then(res => {
			if (res.data.success) {
				if (variables.loadMore) {
					setProperties([...properties, ...res.data.currentProperties]);
					setNearbyProperties([...nearbyProperties, ...res.data.nearbyProperties]);
					setTotalCount(res.data.totalCount);
				} else {
					setProperties(res.data.currentProperties);
					setTotalCount(res.data.totalCount);
					setNearbyProperties(res.data.nearbyProperties);
				}
				setPostSize(res.data.postSize);

				// City search update
				let tmpList = [];
				res.data.currentProperties.forEach(properties => {
					if (properties.property.city && !findFromArray(tmpList, properties.property.city) && !findFromArray(cityList, properties.property.city)) {
						tmpList.push(properties.property.city);
					}
				});
				setCityList([...cityList, ...tmpList]);
			} else {
				alert('Failed to fetch property datas');
			}
		});
	};

	useEffect(() => {
		const params = new URLSearchParams();
		if (search.requested) {
			if (search.city) {
				params.append("city", search.city)
			} else if (!search.city && cityText) {
				params.append("city", cityText)
			} else {
				params.delete("city")
			}
			if (search.purpose) {
				params.append("purpose", search.purpose)
			} else {
				params.delete("purpose")
			}
			if (search.propertyType) {
				params.append("propertyType", search.propertyType)
			} else {
				params.delete("propertyType")
			}
			router.push({search: params.toString()})
		}
	}, [search.city, cityText, search.purpose, search.propertyType])
	
	useEffect(() => {
		console.log(router.query);
		if (router.query) {
			setSearch({
				requested: false,
				city: router.query.city,
				purpose: router.query.purpose,
				propertyType: router.query.propertyType
			})
			getProperties('search', router.query);
		}
	}, [])

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		let tmpList = [];
		pockets.forEach(properties => {
			if (properties.property.city && !findFromArray(tmpList, properties.property.city)) {
				tmpList.push(properties.property.city);
			}
		});
		setCityList([...tmpList]);
		setProperties(pockets);
	}, []);

	return (
		<Layout userInfo={userInfo} style={'black'}>
			<Head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<title>Leads - Cozmo Realty</title>
				<meta name="description" content="" />
				<link rel="canonical" href="https://cozmorealty.com/pocket-listings" />
				<meta property="og:locale" content="en_US" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Leads - Cozmo Realty" />
				<meta property="og:description" content="" />
				<meta property="og:url" content="https://cozmorealty.com/pocket-listings" />
				<meta property="og:site_name" content="Cozmo Realty" />
				<meta property="og:image" content="" />
			</Head>
			<main className="mt-99px">
				<section id="inventory" ref={bodyRef}>
					<Container fluid className="">
						<Row className="h-100 justify-content-sm-center">
							<Col className="p-0 w-100" id="searchbar" xs={12}>
								<SearchBar
									search={search}
									setSearch={setSearch}
									cityList={cityList}
									cityText={cityText}
									setCityText={setCityText}
									getProperties={getProperties}
								/>
							</Col>
							<Col className="p-0" id="list">
								<Properties userInfo={userInfo} properties={properties} width={width} PostSize={PostSize}/>
							</Col>
							<Col className="p-0" id="map">
								<Maps
									setMapBounds={setMapBounds}
									properties={properties}
									propHover={propHover}
									propClick={propClick}
									setPropHover={setPropHover}
									setPropClick={setPropClick}
									defaultStreetView={false}
									streetView={false}
									Center={Center}
									setCenter={setCenter}
								/>
							</Col>
						</Row>
					</Container>
				</section>
			</main>
		</Layout>
	);
};

export const getServerSideProps = async ctx => {
	const cookie = parseCookies(ctx);
	const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
	const userInfo = await getUserInfoSSR(cookieHeader);
	const pockets = await fetchLeads();
	return { props: { userInfo, pockets } };
};

export default Leads;
