import React, { useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { priceTag, shortenPrice } from '../utils/propertyFunctions';
import Link from 'next/link';

const GOOGLE_MAP_API = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const Chip = ({ property, propHover, setPropHover, propClick, setPropClick }) => {
	return (
		<div>
			<Button
				className={`label-chip ${propHover === property._id ? `selected` : ``} border-1-primary-color`}
				onMouseEnter={e => {
					e.preventDefault();
					setPropHover(property._id);
				}}
				onMouseLeave={e => {
					e.preventDefault();
					setPropHover(null);
				}}
				onClick={e => {
					e.preventDefault();
					e.stopPropagation();
					if (propClick === property._id) {
						setPropClick(null);
					} else {
						setPropClick(property._id);
					}
				}}
			>
				<span>{`$${shortenPrice(property.loanAmt)}`}</span>
			</Button>
			<CardChip property={property} propClick={propClick} />
		</div>
	);
};

const CardChip = ({ property, propClick }) => {
	return (
		<Container style={{ display: propClick === property._id ? 'block' : 'none' }} className="card-modal bg-white" onClick={e => e.stopPropagation()}>
			<Row>
				<Row className="content m-8px w-100">
					<Link href={`/property/${property._id}`} className="text-decoration-none invest-cta">
						<Col>
							<Row className="">
								<Col>
									<span className="invest-card-subhead text-capitalize">{property.loanType}</span>
								</Col>
							</Row>
							<Row>
								<Col>
									<span className="invest-amt-val">{property.loanAmt ? `${priceTag(property.loanAmt)}` : '-'}</span>
								</Col>
								<Col className="text-right">
									<span className="invest-interest ">Interest: {property.interestRate ? property.interestRate : '-'}%</span>
								</Col>
							</Row>
							<hr className="mx-21px"></hr>
							<Row>
								<Col>
									<span className="d-block">
										City: <span className="bold-black">{property.property.city ? property.property.city : '-'}</span>
									</span>
									<span className="d-block">
										Type of Loan Request: <span className="bold-black">{property.loanType}</span>
									</span>
								</Col>
							</Row>
						</Col>
					</Link>
				</Row>
			</Row>
		</Container>
	);
};
const Maps = ({ setCenter, Center, setMapBounds, properties, propHover, setPropHover, propClick, setPropClick }) => {
	const googleMapRef = useRef();

	const zoom = 9;

	const handleChange = ({ center, bounds, zoom }) => {
		setMapBounds(bounds);
		setCenter(center);
	};
	const handleMapClick = () => {
		setPropClick(null);
	};
	console.log("----------------\n", properties, "\n==================");
	return (
		<section id="inner-map" className="w-100">
			<GoogleMapReact
				ref={googleMapRef}
				bootstrapURLKeys={{ key: GOOGLE_MAP_API }}
				defaultCenter={{
					lat: 34.5414563,
					lng: -118.6166781,
				}}
				// center={{
				// 	lat: Center.lat ? Center.lat : 34.052235,
				// 	lng: Center.lng ? Center.lng : -118.243683,
				// }}
				center={Center}
				defaultZoom={zoom}
				onChange={handleChange}
				options={{
					maxZoom: 13,
					clickableIcons: false,
				}}
				onChildClick={handleMapClick}
				onClick={handleMapClick}
				onDrag={handleMapClick}
				width="100%"
			>
				{properties.map((property, index) => {
					console.log(property)
					if (property.property && property.property.location) {
						return (
							<Chip
								key={index}
								property={property}
								lat={property.property.location.coordinates[1]}
								lng={property.property.location.coordinates[0]}
								propHover={propHover}
								propClick={propClick}
								setPropClick={setPropClick}
								setPropHover={setPropHover}
								className="hover-z-index"
							/>
						);
					} else {
						return null;
					}
				})}
			</GoogleMapReact>
		</section>
	);
};

export default Maps;
