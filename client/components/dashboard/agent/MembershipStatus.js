import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ClearIcon from '@material-ui/icons/Clear';
import axios from 'axios';
import { API } from '../../../config';
import Link from 'next/link';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CardSection from '../../membership/CardSection';

const MembershipStatus = ({ userInfo, orderInfo, CustomerHistory, SubscriptionList, CardsList }) => {
	const stripe = useStripe();
	const elements = useElements();
	const [SubscriptionListArr, setSubscriptionList] = useState(SubscriptionList);
	const [CardsListArr, setCardsList] = useState(CardsList);
	const [AddCard, setAddCard] = useState(false);

	const cancelPlan = async (id, ind) => {
		await axios({
			method: 'PUT',
			url: `${API}/stripe/CancelSubscription`,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			data: { SubscriptionId: id },
			withCredentials: true,
		})
			.then(d => {
				if (!d.data || !d.data.success) {
					console.log('===error====', d.data);
					return;
				}
				SubscriptionListArr.splice(ind, 1);
				setSubscriptionList([...SubscriptionListArr]);
				console.log('success == ', d.data.message);
			})
			.catch(e => {
				console.log(e);
				return {};
			});
	};

	const removeCard = async (id, ind) => {
		await axios({
			method: 'delete',
			url: `${API}/stripe/card/` + id,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			data: { SubscriptionId: id },
			withCredentials: true,
		})
			.then(d => {
				if (!d.data || !d.data.success) {
					console.log('===error====', d.data);
					return;
				}
				CardsListArr.splice(ind, 1);
				setCardsList([...CardsListArr]);
				console.log('success == ', d.data.message);
			})
			.catch(e => {
				console.log(e);
				return {};
			});
	};
	const addNewCard = async () => {
		if (!stripe || !elements) {
			// Stripe.js has not yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		const { token } = await stripe.createToken(elements.getElement(CardElement));
		if (!token) {
			return console.log('=== no token === ');
		}

		await axios({
			method: 'POST',
			url: `${API}/stripe/card`,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			data: { token: token.id },
			withCredentials: true,
		})
			.then(res => {
				if (res && res.data && res.data.success) {
					console.log(' == success == ', res.data.message);
					setAddCard(false);
					if (res.data.card.existBefore) {
						return console.log('== Exist Before ==', "did not add the card because it's already there");
					}
					CardsListArr.push(res.data.card);
					setCardsList([...CardsListArr]);
				} else {
					console.log('=== add card failed === ', res.data);
				}
			})
			.catch(e => {
				console.log('=== add card failed === ', e);
			});
	};

	const UnixDate = Unix => (Unix ? new Date(Unix * 1000).toLocaleDateString('en-US') : 'Invaild Date');
	return (
		<section id="membership">
			<Container>
				<Row className="mb-5">
					<Col>
						<h1>Membership Status</h1>
					</Col>
				</Row>
				{SubscriptionListArr && SubscriptionListArr.length ? (
					SubscriptionListArr.map((item, i) => (
						<Row key={item.id} className="mb-5">
							<Col>
								<span className="strong">CURRENT PLAN</span>
								<hr></hr>
								{/* put actual product name */}
								<h4 className="strong">Subscription item name</h4>
								{/* put actual product price */}
								<span>
									$ {item?.plan?.amount / 100}.00 per {item?.plan?.interval} ({item.billing})
								</span>
								{/* put next payment date OR "your plan canceled"*/}

								<Row>
									<Col>
										<span className="d-block">Your plan renews on {UnixDate(item?.current_period_end)}</span>.{/* if plan is active, display cancel button */}
										<Button className="solid solid-small mt-351" onClick={() => cancelPlan(item.id, i)}>
											Cancel Plan
										</Button>
									</Col>
								</Row>
							</Col>
						</Row>
					))
				) : (
					<div className="text-left">
						<span> No Subscriptions available </span>
						{/* if plan is deactivated, display renewal plan button */}
						<Link href="/membership/join">
							<Button className="solid solid-small w-100" onClick={renewalPlan}>
								Join Membership Now
							</Button>
						</Link>
					</div>
				)}
				<Row>
					<Col className="mb-5">
						<span className="strong">PAYMENT METHOD</span>
						<hr></hr>

						{CardsListArr && CardsListArr.length ? (
							CardsListArr.map((item, i) => (
								<Row key={item.id}>
									<Col>
										<span>●●●●{item.last4}</span>
									</Col>
									<Col>
										<span>{item.brand}</span>
									</Col>
									<Col>
										Expires {item.exp_month}/{item.exp_year}
										<button className="btn btn-outline-none" onClick={() => removeCard(item.id, i)}>
											<ClearIcon />
										</button>
									</Col>
								</Row>
							))
						) : (
							<div className="text-left">
								<span> No Payment Method Available </span>
							</div>
						)}
						<Row className="mt-2 mb-5">
							<Col>
								{AddCard ? (
									<Row>
										<Col>
											<CardSection />
										</Col>
										<Col>
											<Button type="button" onClick={addNewCard} className="solid">
												Add Card
											</Button>
										</Col>
									</Row>
								) : (
									<Button className="solid solid-small" onClick={() => setAddCard(true)}>
										+ Add payment method
									</Button>
								)}
							</Col>
						</Row>
					</Col>
				</Row>
				<Row>
					<Col>
						<span className="strong">BILLING HISTORY</span>
						<hr></hr>
						{CustomerHistory && CustomerHistory.length ? (
							CustomerHistory.map((item, i) => (
								<Row key={item.id}>
									<Col>{UnixDate(item?.date)}</Col>
									<Col>$ {item.amount_paid / 100}</Col>
									<Col>{item.status}</Col>
									<Col>{item.billing_reason}</Col>
								</Row>
							))
						) : (
							<p className="text-center">No History available</p>
						)}

						{/* <Row>
							<Col>May 1, 2020</Col>
							<Col>$100</Col>
							<Col>Subscription item name</Col>
						</Row>
						<Row>
							<Col>Apr 1, 2020</Col>
							<Col>$100</Col>
							<Col>Subscription item name</Col>
						</Row>  */}
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default MembershipStatus;
