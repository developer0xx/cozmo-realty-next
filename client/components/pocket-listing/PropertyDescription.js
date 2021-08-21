import React from 'react';

const PropertyDescription = ({ propertyInfo }) => {
	return (
		<section id="p-description" className="description my-5 ">
			<div className="bg-illust-wrapper">
				<figure className="top-waffle" />
			</div>

			<h3>Property Description</h3>

			{/* <BRStick /> */}
			<div className="p-description-subsection">
				{propertyInfo.loandescription ? (
					<>
						<h4 className="text-capitalize description-headline">Detailed loan description</h4>
						<p className="pl-3">{propertyInfo.loandescription}</p>
					</>
				) : null}
				{propertyInfo.paybackPlan ? (
					<>
						<h4 className="text-capitalize description-headline">Exit strategy</h4>
						<p className="pl-3">{propertyInfo.paybackPlan}</p>
					</>
				) : null}
			</div>
		</section>
	);
};

export default PropertyDescription;
