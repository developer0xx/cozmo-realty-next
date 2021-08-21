/**
 * Use the CSS tab above to style your Element's container.
 */
import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CardSection = () => {
	const CARD_ELEMENT_OPTIONS = {
		hidePostalCode: true,
		style: {
			base: {
				color: '#32325d',
				fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
				fontSmoothing: 'antialiased',
				fontSize: '16px',
				'::placeholder': {
					color: '#aab7c4',
				},
			},
			invalid: {
				color: '#fa755a',
				iconColor: '#fa755a',
			},
		},
	};
	return <CardElement options={CARD_ELEMENT_OPTIONS} />;
};

export default CardSection;
