import React from 'react';
// import { BRStick } from '../../components/global/svgs';
// import { priceTag, totalAmtOwned } from '../utils/functions';

const Chart = ({ mortgageBalance }) => {
	const firstColNames = ['', 'existing 1st note', 'existing 2nd note', 'existing 3rd note', 'total amt. owned'];

	const listGenerator = (header, objKey, arr, number) => {
		let list = [];

		for (let i = -1; i < number; i++) {
			if (i === -1) {
				list.push(
					<li key={i} className="text-capitalize">
						<span className="text-center px-3 w-100 font-weight-bold">{header}</span>
					</li>
				);
			} else {
				list.push(
					<li key={i} className="text-capitalize">
						<span className="text-center px-3 w-100">
							{arr[i] && arr[i][objKey] && objKey === 'balanceAmt' && i + 1 !== number ? mortgageBalance[i][objKey] : ''}
							{objKey === 'balanceAmt' && i + 1 === number ? mortgageBalance : ''}
							{arr[i] && arr[i][objKey] && objKey === 'lenderType' ? mortgageBalance[i][objKey] : ''}
							{arr[i] && arr[i][objKey] && objKey === 'maturityDate' ? mortgageBalance[i][objKey] : ''}
							{arr[i] && arr[i][objKey] && objKey === 'currentRate' ? mortgageBalance[i][objKey] + '%' : ''}
						</span>
					</li>
				);
			}
		}
		return list;
	};

	return (
		<div className="info-table mt-4">
			<div className="col-table ">
				<ul>
					{firstColNames.map((name, index) => {
						return (
							<li key={index} className="text-capitalize">
								<span className="text-left px-3 w-100 font-weight-bold">{name}</span>
							</li>
						);
					})}
				</ul>
			</div>
			<div className="col-table">
				<ul>{listGenerator('Balance Amount', 'balanceAmt', mortgageBalance, 4)}</ul>
			</div>
			<div className="col-table">
				<ul>{listGenerator('Lendery Type', 'lenderType', mortgageBalance, 4)}</ul>
			</div>
			<div className="col-table">
				<ul>{listGenerator('Maturity Date', 'maturityDate', mortgageBalance, 4)}</ul>
			</div>
			<div className="col-table">
				<ul>{listGenerator('Current Int. Rate', 'currentRate', mortgageBalance, 4)}</ul>
			</div>
		</div>
	);
};
const MorgageInfo = props => {
	const p = props.propertyInfo;

	return (
		<div id="morgage-info" className="mt-4">
			<h3>Current Mortgage Balance</h3>
			{/* <BRStick /> */}
			{p.loanType === 'refinance/cash out' ? <Chart mortgageBalance={p.mortgageBalance.index} /> : null}
			{p.loanType === '2nd' ? <Chart mortgageBalance={p.mortgageBalance.index} /> : null}
			{p.loanType === '3rd' ? <Chart mortgageBalance={p.mortgageBalance.index} /> : null}
			{p.loanType === 'bridge/mezz' ? <Chart mortgageBalance={p.mortgageBalance.index} /> : null}
		</div>
	);
};

export default MorgageInfo;
