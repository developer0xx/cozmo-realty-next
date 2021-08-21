export const trimAddress = ({ line1 }) => {
	return line1.trim().substr(line1.indexOf(' ') + 1);
};

export const priceTag = price => {
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
		numFormat = numFormat.join('');
		return '$' + numFormat;
	} else {
		return 0;
	}
};

export const shortenPrice = n => {
	if (n) {
		let x = n.toString();
		if (x.length > 9) {
			return Math.round(n / 100000000) / 10 + 'B';
		} else if (x.length > 6) {
			return Math.round(n / 100000) / 10 + 'M';
		} else if (x.length > 3) {
			return x.slice(0, -3) + 'K';
		} else {
			return priceTag(n);
		}
	} else {
		return '-';
	}
};
