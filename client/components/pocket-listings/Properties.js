import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Pagination from 'react-bootstrap/Pagination';
import Spinner from '../Spinner';
import useHistoryState from '../utils/useHistoryState';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { trimAddress, priceTag } from '../utils/propertyFunctions';

const Properties = props => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const Properties = props.properties;

	const { nearbyProperties, PostSize, propHover, setPropHover, width } = props;

	const [page, setPage] = useHistoryState(1, 'page');

	const changePage = (e, pNum) => {
		setPage(pNum);
	};

	const paginationVal = total => {
		return total / 20 === 1 ? 1 : Math.floor(total / 20) === 0 ? 1 : Math.floor(total / 20) && total % 20 === 0 ? total / 20 : Math.floor(total / 20) + 1;
	};

	const pageArray = pNum => {
		let pArr = [];
		for (let i = 1; i <= pNum; i++) {
			pArr = [...pArr, i];
		}
		return pArr;
	};

	const iconObj = {
		"apartment": "/property/icon_Apartment.png",
		"condo": "/property/icon_Condo.png",
		"freestanding": "/property/icon_Freestanding.png",
		"industrial": "/property/icon_Industrial.png",
		"mixedUse": "/property/icon_MixedUse.png",
		"multiFamily": "/property/icon_MultiFamily.png",
		"officeBuilding": "/property/icon_OfficeBuilding.png",
		"sfr": "/property/icon_SFR.png",
		"shoppingCenter": "/property/icon_ShoppingCenter.png",
		"commercial": "/property/icon_MixedUse.png",
		"residential": "/property/icon_SFR.png",
		"noType": "/property/icon_Freestanding.png"
	}

	const displayIcon = subtype => {
		if ( subtype && iconObj[subtype]) {
			return (
				<img
					src={iconObj[subtype]}
					width="50"
					height="50"
					alt="property"
					className="property-icon-img"
					onError={e => {
						e.target.onerror = null;
						e.target.src = iconObj[subtype];
					}}
				/>
			)
		} else {
			return (
				<img
					src={iconObj["noType"]}
					width="50"
					height="50"
					alt="property"
					className="property-icon-img"
					onError={e => {
						e.target.onerror = null;
						e.target.src = iconObj["noType"];
					}}
				/>
			)
		}
	}

	const mobileView = p => (
		<Link href={`/property/${p._id}`}>
			<Container fluid className="property bg-white my-5px p-0">
				<Row className="p-15px">
					<Col xs={12} className="d-flex" onClick={e => e.preventDefault()}>
						<div className="property-icon-wrapper">
							{displayIcon(p.propertySubType)}
						</div>
					</Col>
					<Col xs={12}>
						<div className="content px-15px">
							<div className="left-col">
								<span className="d-block lead-desc-fonts dark-font-color text-no-hover">
									Test Ave, Test City, TEST, 00000
								</span>
								<img alt="gradient" className="gradient" src="/icons/inventory-gradient.png"></img>
								<Container fluid>
									<Row>
									</Row>
								</Container>
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		</Link>
	);

	const desktopView = p => (
		<Link href={`/pocket-listings/${p._id}`}>
			<Container fluid className="property bg-white my-5px p-0">
				<Row className="p-15px max-h-211px">
					<Col className="d-flex">
						<div className="property-icon-wrapper">
							{displayIcon(p.propertySubType ? p.propertySubType : (p.propertyType ? p.propertyType : 'noType'))}
						</div>
						<div className="content px-15px">
							<div className="left-col">
								<Container fluid>
									<Row>
										<Col md={4} className="p-0 d-flex justify-content-center">
											<span className="d-block w-100 m-auto lead-desc-fonts dark-font-color text-capitalize text-no-hover text-nowrap">
												{trimAddress(p.property)}, <br/>{p.property.city}
											</span>
										</Col>
										<Col md={3} className="p-0 d-flex justify-content-center">
											<span className="fw-600 w-100 m-auto lead-desc-fonts text-no-hover text-capitalize">
												{priceTag(p.askingPrice)}
											</span>
										</Col>
										<Col md={3} className="p-0 d-flex justify-content-center">
											<span className="fw-600 w-100 m-auto lead-desc-fonts text-no-hover text-capitalize">
												{p.propertySubType}
											</span>
										</Col>
										<Col md={2} className="p-0 d-flex justify-content-center">
											<span className="w-100 my-auto">
												<Badge pill variant="dark" className="ml-0 my-auto">
													<span className="fw-600 w-100 m-auto lead-desc-fonts text-no-hover text-capitalize">
														{p.purpose}
													</span>
												</Badge>
											</span>
										</Col>
									</Row>
								</Container>
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		</Link>
	);

	const properties = Properties.slice((page - 1) * 20, page * 20).map(p => {
		console.log(p);
		return (
			<div
				key={p._id}
				className="no-deco hover-effect"
				/* onMouseEnter={() => {
					setPropHover(p._id);
				}}
				onMouseLeave={() => {
					setPropHover(false);
				}} */
			>
				{width >= 768 ? desktopView(p) : mobileView(p)}
			</div>
		);
	});
	return (
		<>
			<Row>
				<Col id="inner-list">
					{properties && properties.length ? (
						<>
							{
								width >= 768 ? (
									<Container fluid className="property bg-white my-5px p-0">
										<Row className="p-15px max-h-211px">
											<Col className="d-flex">
												<div className="property-label-placeholder">
													
												</div>
												<div className="content px-15px m-0">
													<div className="left-col">
														<Container fluid>
															<Row>
																<Col xs={4} className="p-0">
																	<span className="d-block lead-label-fonts text-no-hover">Address</span>
																</Col>
																<Col xs={3} className="p-0">
																	<span className="d-block lead-label-fonts text-no-hover">Asking&nbsp;Price</span>
																</Col>
																<Col xs={3} className="p-0">
																	<span className="d-block lead-label-fonts text-no-hover">Prop.&nbsp;Type</span>
																</Col>
																<Col xs={2} className="p-0">
																	<span className="d-block lead-label-fonts text-no-hover">Purpose&nbsp;</span>
																</Col>
															</Row>
														</Container>
													</div>
												</div>
											</Col>
										</Row>
									</Container>
								) : ''
							}
							{properties}
							<Pagination>
								<Pagination.Prev disabled={page === 1} onClick={e => changePage(e, page - 1)}>
									Prev
								</Pagination.Prev>

								{pageArray(paginationVal(Properties.length)).map((i, index) => (
									<Pagination.Item key={index} onClick={e => changePage(e, i)} active={i === page}>
										{i}
									</Pagination.Item>
								))}

								<Pagination.Next disabled={page === paginationVal(Properties.length)} onClick={e => changePage(e, page + 1)}>
									Next
								</Pagination.Next>
							</Pagination>
						</>
					) : PostSize === 'empty' ? (
						<div
							style={{
								height: 'calc(50vh - 4rem)',
								fontSize: '20pt',
								display: 'flex',
								textAlign: 'center',
								alignContent: 'center',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							No search results found.
						</div>
					) : (
						<Spinner />
					)}
				</Col>
			</Row>
		</>
	);
};

export default Properties;
