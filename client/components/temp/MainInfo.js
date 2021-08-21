import React from 'react';

const priceTag = price => {
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
		return numFormat.join('');
	} else {
		return 0;
	}
};

const Chart = ({ obj }) => {
	return (
		<div className="info-table mt-4">
			<div className="info-left">
				<ul>
					{Object.keys(obj).map((name, index) => {
						if (obj[name]?.length > 0) {
							return (
								<li key={index} className="overflow-ellipsis text-capitalize ">
									{name}
								</li>
							);
						}
					})}
				</ul>
			</div>
			<div className="info-right">
				<ul>
					{Object.keys(obj).map((name, index) => {
						if (obj[name]?.length > 0) {
							return (
								<li key={index} className="text-capitalize overflow-ellipsis">
									<span className="text-left pl-3 w-100">{obj[name]}</span>
								</li>
							);
						}
					})}
				</ul>
			</div>
		</div>
	);
};

const MainInfo = props => {
	const p = props.propertyInfo;

	const all = {
		'Property Type': p.typeOfProperty,
		Address: `${p.subjectPropertyAddr.city + ' ' + p.subjectPropertyAddr.state + ' ' + p.subjectPropertyAddr.country}`,
		Zoning: p.zoning,
		'Lot Size': p.lotSize,
		'Land State': `${p.landState === 'improvedLand' ? 'Improved Land' : ''}${p.landState === 'rawLand' ? 'Raw Land' : ''}`,
		Ownersihp: `${p.ownership === 'feeSimple' ? 'Fee Simple' : ''}${p.ownership === 'groundLease' ? 'Ground Lease' : ''}`,
		'Entitlement Process Completed': `${p.entitlementProcess ? p.entitlementProcess : ''}`,
		'Including Land Cost': `${p.includingLandCost === 'true' ? 'Yes' : ''}${p.includingLandCost === 'false' ? 'No' : ''}`,
		'Current Estimated Value': `${p.currentEstValue ? priceTag(p.currentEstValue) : ''} `,
		[p.loanType === 'fix & flip/Rehab' ? 'Total Loan Amount:' : 'Loan Amount:']: p.loanType === 'fix & flip/Rehab' ? priceTag(p.loanAmt + p.fixUpCost) : priceTag(p.loanAmt),
		LTV: `${p.loanType === 'fix & flip/Rehab'}%`,
		'Interest Rate Requested': `${p.interestRate ? p.interestRate + '%' : ''}`,
		'Term Requested': `${p.term ? p.term : ''}`,
		'Purchase Price': priceTag(p.purchasePrice),
		'Down Payment': priceTag(p.downPayment),
		'Seller Carry': priceTag(p.sellerCarry),
		'Recent Appraisal': `${p.appraisalReport === 'true' ? 'Yes' : ''}${p.appraisalReport === 'false' ? 'No' : ''}`,
		'Recent Environmental Report': `${p.environmentalReport === 'true' ? 'Yes' : ''}${p.environmentalReport === 'false' ? 'No' : ''}`,
		'Judgements, Liens, NOD, NTS': `${p.judgementsOrLiensRecoreded ? p.judgementsOrLiensRecoreded + ', ' + priceTag(p.totalAmtRecoreded) + ' on ' + p.dateRecorded : ''}`,
		'Escrow Opend?': `${p.escrowOpened === 'true' ? 'Yes' : ''}${p.escrowOpened === 'false' ? 'No' : ''}`,
		'Fix Up Cost': priceTag(p.fixUpCost),
		'After Remodeling Value': priceTag(p.afterRemodelingValue),
		'ARV:': `${p.loanAmt}`,
		'Estimated Time To Fix': p.estTimeToFix,
	};

	return (
		<div id="mainInfo">
			<section className="info mt-4">
				<span className="info-type text-capitalize">{p.loanType} Loan</span> , <span className="info-city">{p.borrowingEntity ? p.borrowingEntity : ''}</span>
				{p.subjectPropertyAddr.city ? <h3 className="info-address">{p.subjectPropertyAddr.city}</h3> : 'null'}
			</section>
			<Chart obj={all} />
		</div>
	);
};

export default MainInfo;
